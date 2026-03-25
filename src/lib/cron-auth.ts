import { timingSafeEqual, createHmac } from "crypto";

export function verifyCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");

  // Hash both values to normalize length and prevent timing leaks
  const tokenHash = createHmac("sha256", "cron").update(token).digest();
  const secretHash = createHmac("sha256", "cron").update(secret).digest();

  return timingSafeEqual(tokenHash, secretHash);
}
