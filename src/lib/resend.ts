import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.AUTH_RESEND_KEY) return null;
  if (!_resend) {
    _resend = new Resend(process.env.AUTH_RESEND_KEY);
  }
  return _resend;
}
