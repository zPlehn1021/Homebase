import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { featureRequests, featureVotes, users } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { parseId } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db, userId } = authResult;
  const { id } = await params;
  const featureId = parseId(id);
  if (!featureId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  // Verify the feature request exists and is in voting status
  const existing = await db
    .select()
    .from(featureRequests)
    .where(eq(featureRequests.id, featureId))
    .limit(1);

  if (!existing[0] || existing[0].status !== "voting") {
    return Response.json({ error: "Not found or not open for voting" }, { status: 404 });
  }

  // Check if user already voted
  const existingVote = await db
    .select()
    .from(featureVotes)
    .where(
      and(
        eq(featureVotes.featureRequestId, featureId),
        eq(featureVotes.userId, userId)
      )
    )
    .limit(1);

  let voted: boolean;

  if (existingVote[0]) {
    // Remove vote
    await db
      .delete(featureVotes)
      .where(
        and(
          eq(featureVotes.featureRequestId, featureId),
          eq(featureVotes.userId, userId)
        )
      );
    voted = false;
  } else {
    // Add vote
    await db.insert(featureVotes).values({
      featureRequestId: featureId,
      userId,
    });
    voted = true;
  }

  // Recount votes
  const voteResult = await db
    .select({ count: count() })
    .from(featureVotes)
    .where(eq(featureVotes.featureRequestId, featureId));
  const voteCount = voteResult[0].count;

  // Check 40% threshold
  const activeUsers = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.purchaseVerified, true));
  const totalActiveUsers = activeUsers[0].count;
  const threshold = Math.ceil(totalActiveUsers * 0.4);

  if (voteCount >= threshold && threshold > 0) {
    await db
      .update(featureRequests)
      .set({ status: "community_approved" })
      .where(eq(featureRequests.id, featureId));
  }

  return Response.json({ voted, voteCount, totalActiveUsers });
}
