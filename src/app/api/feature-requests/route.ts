import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { getAdminUser } from "@/lib/admin-helpers";
import { featureRequests, featureVotes, users } from "@/db/schema";
import { eq, count, sql, and } from "drizzle-orm";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope") || "voting";

  // Admin scopes
  if (scope === "pending" || scope === "community_approved") {
    const admin = await getAdminUser();
    if (!admin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { db } = admin;

    const requests = await db
      .select({
        id: featureRequests.id,
        userId: featureRequests.userId,
        title: featureRequests.title,
        description: featureRequests.description,
        status: featureRequests.status,
        createdAt: featureRequests.createdAt,
        resolvedAt: featureRequests.resolvedAt,
        submitterName: users.name,
      })
      .from(featureRequests)
      .leftJoin(users, eq(featureRequests.userId, users.id))
      .where(eq(featureRequests.status, scope))
      .orderBy(featureRequests.createdAt);

    // For community_approved, include vote counts
    if (scope === "community_approved") {
      const withVotes = await Promise.all(
        requests.map(async (r) => {
          const votes = await db
            .select({ count: count() })
            .from(featureVotes)
            .where(eq(featureVotes.featureRequestId, r.id));
          return { ...r, voteCount: votes[0].count };
        })
      );
      return Response.json(withVotes);
    }

    return Response.json(requests);
  }

  // User scopes
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db, userId } = authResult;

  if (scope === "my") {
    const requests = await db
      .select()
      .from(featureRequests)
      .where(eq(featureRequests.userId, userId))
      .orderBy(featureRequests.createdAt);
    return Response.json(requests);
  }

  // scope === "voting" — all requests open for voting
  const activeUsers = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.purchaseVerified, true));
  const totalActiveUsers = activeUsers[0].count;

  const requests = await db
    .select({
      id: featureRequests.id,
      userId: featureRequests.userId,
      title: featureRequests.title,
      description: featureRequests.description,
      status: featureRequests.status,
      createdAt: featureRequests.createdAt,
      resolvedAt: featureRequests.resolvedAt,
      submitterName: users.name,
      voteCount: sql<number>`(SELECT COUNT(*) FROM feature_votes WHERE feature_request_id = ${featureRequests.id})`,
      hasVoted: sql<number>`(SELECT COUNT(*) FROM feature_votes WHERE feature_request_id = ${featureRequests.id} AND user_id = ${userId})`,
    })
    .from(featureRequests)
    .leftJoin(users, eq(featureRequests.userId, users.id))
    .where(eq(featureRequests.status, "voting"))
    .orderBy(featureRequests.createdAt);

  const result = requests.map((r) => ({
    ...r,
    hasVoted: (r.hasVoted as number) > 0,
    totalActiveUsers,
  }));

  return Response.json(result);
}

export async function POST(request: NextRequest) {
  const authResult = await getAuthenticatedUser();
  if (!authResult) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { db, userId } = authResult;

  const body = await request.json();
  const { title, description } = body;

  if (!title?.trim() || !description?.trim()) {
    return Response.json(
      { error: "Title and description are required" },
      { status: 400 }
    );
  }

  if (title.length > 200) {
    return Response.json(
      { error: "Title must be under 200 characters" },
      { status: 400 }
    );
  }

  if (description.length > 2000) {
    return Response.json(
      { error: "Description must be under 2000 characters" },
      { status: 400 }
    );
  }

  const result = await db
    .insert(featureRequests)
    .values({
      userId,
      title: title.trim(),
      description: description.trim(),
    })
    .returning();

  return Response.json(result[0], { status: 201 });
}
