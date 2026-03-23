import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  purchases,
} from "@/db/schema";
import { eq } from "drizzle-orm";

const db = getDb();

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: db
    ? DrizzleAdapter(db, {
        usersTable: users as any,
        accountsTable: accounts as any,
        sessionsTable: sessions as any,
        verificationTokensTable: verificationTokens as any,
      })
    : undefined,
  session: { strategy: "database" },
  providers: [
    Resend({
      from: "Homebase <noreply@plehnlabs.com>",
    }),
    Google,
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verify=true",
  },
  callbacks: {
    async session({ session, user }) {
      if (db && user?.id) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, Number(user.id)))
          .limit(1);
        if (dbUser[0]) {
          const s = session as any;
          s.user.id = String(dbUser[0].id);
          s.user.purchaseVerified = dbUser[0].purchaseVerified;
          s.user.onboardingCompleted = dbUser[0].onboardingCompleted;
          s.user.propertyType = dbUser[0].propertyType;
          s.user.squareFootage = dbUser[0].squareFootage;

          // Auto-link: if user isn't verified, check for a matching purchase
          if (!dbUser[0].purchaseVerified && dbUser[0].email) {
            const matchingPurchase = await db
              .select({ id: purchases.id })
              .from(purchases)
              .where(eq(purchases.email, dbUser[0].email.toLowerCase()))
              .limit(1);

            if (matchingPurchase.length > 0) {
              await db
                .update(users)
                .set({ purchaseVerified: true })
                .where(eq(users.id, dbUser[0].id));
              await db
                .update(purchases)
                .set({ userId: dbUser[0].id })
                .where(eq(purchases.email, dbUser[0].email.toLowerCase()));
              s.user.purchaseVerified = true;
            }
          }
        }
      }
      return session;
    },
  },
});
