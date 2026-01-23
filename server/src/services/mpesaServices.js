import axios from "axios";
import crypto from "crypto";

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;

    // FIX 1: Use the correct base URL variable from your .env
    this.baseURL = process.env.MPESA_SANDBOX_URL;

    this.callbackURL = process.env.MPESA_CALLBACK_URL;
    this.timeoutURL = process.env.MPESA_TIMEOUT_URL; // Ensure this is defined if used

    // FIX 2: Construct the full API URLs needed by the methods
    this.AUTH_URL = `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`;
    this.STK_URL = `${this.baseURL}/mpesa/stkpush/v1/processrequest`;
    this.QUERY_URL = `${this.baseURL}/mpesa/stkpushquery/v1/query`;
  }

  // Generate access token
  async getAccessToken() {
    try {
      const auth = Buffer.from(
        `${this.consumerKey}:${this.consumerSecret}`,
      ).toString("base64");

      // FIX 3: Use the constructed AUTH_URL
      const response = await axios.get(this.AUTH_URL, {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.access_token;
    } catch (error) {
      console.error(
        "M-Pesa auth error:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to get M-Pesa access token");
    }
  }

  // Generate password for STK Push
  generatePassword() {
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14); // Corrected slice to get 14 digits
    const password = Buffer.from(
      `${this.shortcode}${this.passkey}${timestamp}`,
    ).toString("base64");
    return { password, timestamp };
  }

  // Initiate STK Push
  async stkPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      console.log("🔵 STK Push Initiated:", {
        phoneNumber,
        amount,
        accountReference,
      });

      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      // Format phone number (remove + and ensure it starts with 254)
      const formattedPhone = phoneNumber
        .replace(/^\+/, "")
        .replace(/^0/, "254");
      console.log("📱 Phone Number Formatted:", {
        input: phoneNumber,
        output: formattedPhone,
      });

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackURL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      };

      console.log("📤 STK Push Request Body:", requestBody);

      // FIX 4: Use the constructed STK_URL
      const response = await axios.post(this.STK_URL, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ STK Push Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ STK Push error:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to initiate M-Pesa payment");
    }
  }

  // Query STK Push status
  async querySTKStatus(checkoutRequestID) {
    try {
      console.log("🔵 Query STK Status Started:", { checkoutRequestID });

      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      };

      console.log("📤 Query STK Request Body:", requestBody);

      // FIX 5: Use the constructed QUERY_URL
      const response = await axios.post(this.QUERY_URL, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Query STK Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ STK Query error:",
        error.response?.data || error.message,
      );
      throw new Error("Failed to query M-Pesa payment status");
    }
  }
}

export default new MpesaService();
