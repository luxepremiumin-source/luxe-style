import { Email } from "@convex-dev/auth/providers/Email";
import axios from "axios";
import { alphabet, generateRandomString } from "oslo/crypto";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 30, // 30 minutes for OTP validity
  generateVerificationToken() {
    const token = generateRandomString(6, alphabet("0-9"));
    console.log(`[OTP] Generated token: ${token}`);
    return token;
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    try {
      console.log(`[OTP] Sending OTP to ${email}, token: ${token}`);
      
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
            "Content-Type": "application/json",
          },
          timeout: 20000,
        },
      );
      
      console.log(`[OTP] Successfully sent to ${email}. Status: ${response.status}`);
      if (response.data) {
        console.log(`[OTP] Response:`, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error(`[OTP] Failed to send to ${email}:`, error instanceof Error ? error.message : String(error));
      if (axios.isAxiosError(error)) {
        console.error(`[OTP] HTTP Error:`, error.response?.status, error.response?.data);
      }
      throw new Error(`Failed to send OTP: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});