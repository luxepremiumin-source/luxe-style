import { Email } from "@convex-dev/auth/providers/Email";
import axios from "axios";
import { alphabet, generateRandomString } from "oslo/crypto";

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 30, // 30 minutes for OTP validity
  generateVerificationToken() {
    const token = generateRandomString(6, alphabet("0-9"));
    console.log(`Generated OTP token: ${token}`);
    return token;
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    try {
      console.log(`Attempting to send OTP to ${email} with token: ${token}`);
      
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
          timeout: 15000,
        },
      );
      
      console.log(`OTP successfully sent to ${email}. Response status: ${response.status}`);
      console.log(`Response data:`, response.data);
    } catch (error) {
      console.error(`Failed to send OTP to ${email}:`, error instanceof Error ? error.message : String(error));
      if (axios.isAxiosError(error)) {
        console.error(`Axios error details:`, error.response?.data);
      }
      throw new Error(`Failed to send OTP: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});