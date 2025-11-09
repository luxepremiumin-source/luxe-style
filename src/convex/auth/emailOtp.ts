import { Email } from "@convex-dev/auth/providers/Email";
import axios from "axios";
import { alphabet, generateRandomString } from "oslo/crypto";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 30, // Increased from 15 to 30 minutes for better UX
  // This function can be asynchronous
  generateVerificationToken() {
    return generateRandomString(6, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    try {
      const response = await axios.post(
        "https://email.vly.ai/send_otp",
        {
          to: email,
          otp: token,
          appName: process.env.VLY_APP_NAME || "LUXE - Premium Accessories",
        },
        {
          headers: {
            "x-api-key": "vlytothemoon2025",
          },
          timeout: 10000, // Add timeout to prevent hanging
        },
      );
      
      // Log for debugging
      console.log(`OTP sent to ${email}:`, response.status);
    } catch (error) {
      console.error(`Failed to send OTP to ${email}:`, error);
      throw new Error(`Failed to send OTP: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});