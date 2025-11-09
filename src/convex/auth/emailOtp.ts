import { Email } from "@convex-dev/auth/providers/Email";
import { Resend } from "resend";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 30, // 30 minutes for OTP validity
  async sendVerificationRequest({ identifier: email, provider, token }) {
    try {
      console.log(`[OTP] Sending OTP to ${email}, token: ${token}`);
      
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      const resend = new Resend(apiKey);
      const from = process.env.RESEND_FROM_EMAIL?.trim() || "LUXE <onboarding@resend.dev>";
      const replyTo = process.env.RESEND_REPLY_TO?.trim() || "luxe.premium.in@gmail.com";

      const { error } = await resend.emails.send({
        from,
        to: [email],
        subject: "Your LUXE Verification Code",
        html: `
          <div style="font-family: Helvetica Neue, Arial, sans-serif; color: #111; line-height: 1.6;">
            <h1 style="margin:0 0 12px; font-size: 24px;">Your Verification Code</h1>
            <p style="margin:0 0 12px; font-size: 16px;">Enter this code to verify your email:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #000;">${token}</p>
            </div>
            <p style="margin:0 0 12px; color: #666; font-size: 14px;">This code expires in 30 minutes.</p>
            <p style="margin:0 0 12px;">— Team LUXE</p>
          </div>
        `,
        text: `Your LUXE Verification Code: ${token}\n\nEnter this code to verify your email. This code expires in 30 minutes.\n\n— Team LUXE`,
        replyTo,
      });

      if (error) {
        const msg = (error as any)?.message || JSON.stringify(error);
        throw new Error(`Resend error: ${msg}`);
      }

      console.log(`[OTP] Successfully sent to ${email}`);
    } catch (error) {
      console.error(`[OTP] Failed to send to ${email}:`, error instanceof Error ? error.message : String(error));
      throw new Error(`Failed to send OTP: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});