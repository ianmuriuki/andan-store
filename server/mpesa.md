# M-Pesa Integration Guide for Andan Grocery

## Overview
This guide provides comprehensive instructions for integrating M-Pesa payments into the Andan Grocery e-commerce system using Safaricom's Daraja API.

## Prerequisites

### 1. Safaricom Developer Account
1. Visit [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an account or sign in
3. Complete the verification process

### 2. Create an App
1. Navigate to "My Apps" in the developer portal
2. Click "Create App"
3. Fill in the required details:
   - **App Name**: Andan Grocery
   - **Description**: Online grocery delivery platform
   - **Environment**: Choose Sandbox for testing, Production for live

### 3. Get API Credentials
After creating the app, you'll receive:
- **Consumer Key**: Used for authentication
- **Consumer Secret**: Used for authentication
- **Shortcode**: Your business shortcode (for sandbox: 174379)
- **Passkey**: Used for STK Push (for sandbox: provided by Safaricom)

## Environment Configuration

### Server Environment Variables
Add these to your `server/.env` file:

```bash
# M-Pesa Configuration
MPESA_ENVIRONMENT=sandbox  # or 'production' for live
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379  # Sandbox shortcode
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback
MPESA_TIMEOUT_URL=https://yourdomain.com/api/payments/mpesa/timeout

# Sandbox URLs
MPESA_BASE_URL=https://sandbox.safaricom.co.ke
MPESA_AUTH_URL=https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
MPESA_STK_URL=https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
MPESA_QUERY_URL=https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query

# Production URLs (when ready)
# MPESA_BASE_URL=https://api.safaricom.co.ke
# MPESA_AUTH_URL=https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
# MPESA_STK_URL=https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest
# MPESA_QUERY_URL=https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query
```

## Implementation

### 1. M-Pesa Service Class

Create `server/src/services/mpesaService.js`:

```javascript
import axios from 'axios';
import crypto from 'crypto';

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.baseURL = process.env.MPESA_BASE_URL;
    this.callbackURL = process.env.MPESA_CALLBACK_URL;
    this.timeoutURL = process.env.MPESA_TIMEOUT_URL;
  }

  // Generate access token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(process.env.MPESA_AUTH_URL, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa auth error:', error.response?.data || error.message);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  // Generate password for STK Push
  generatePassword() {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  // Initiate STK Push
  async stkPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      // Format phone number (remove + and ensure it starts with 254)
      const formattedPhone = phoneNumber.replace(/^\+/, '').replace(/^0/, '254');

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackURL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      };

      const response = await axios.post(process.env.MPESA_STK_URL, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('STK Push error:', error.response?.data || error.message);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  // Query STK Push status
  async querySTKStatus(checkoutRequestID) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };

      const response = await axios.post(process.env.MPESA_QUERY_URL, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('STK Query error:', error.response?.data || error.message);
      throw new Error('Failed to query M-Pesa payment status');
    }
  }
}

export default new MpesaService();
```

### 2. Payment Controller

Create `server/src/controllers/paymentController.js`:

```javascript
import { Order } from '../models/Order.js';
import mpesaService from '../services/mpesaService.js';

// Initiate M-Pesa payment
export const initiateMpesaPayment = async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body;

    // Get order details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Initiate STK Push
    const stkResponse = await mpesaService.stkPush(
      phoneNumber,
      order.totalPrice,
      order.orderNumber,
      `Payment for order ${order.orderNumber}`
    );

    // Update order with payment info
    order.paymentInfo.transactionId = stkResponse.CheckoutRequestID;
    order.paymentInfo.method = 'mpesa';
    await order.save();

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        checkoutRequestID: stkResponse.CheckoutRequestID,
        merchantRequestID: stkResponse.MerchantRequestID,
        responseCode: stkResponse.ResponseCode,
        responseDescription: stkResponse.ResponseDescription
      }
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// M-Pesa callback handler
export const mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;

    console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback;

    // Find order by checkout request ID
    const order = await Order.findOne({
      'paymentInfo.transactionId': CheckoutRequestID
    });

    if (!order) {
      console.error('Order not found for CheckoutRequestID:', CheckoutRequestID);
      return res.status(200).json({ message: 'Order not found' });
    }

    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;

      // Update order payment status
      order.paymentInfo.status = 'completed';
      order.paymentInfo.mpesaReceiptNumber = mpesaReceiptNumber;
      order.paymentInfo.paidAt = new Date();
      order.status = 'confirmed';

      await order.save();

      console.log(`Payment successful for order ${order.orderNumber}`);
    } else {
      // Payment failed
      order.paymentInfo.status = 'failed';
      await order.save();

      console.log(`Payment failed for order ${order.orderNumber}: ${ResultDesc}`);
    }

    res.status(200).json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.status(500).json({ message: 'Callback processing failed' });
  }
};

// Query payment status
export const queryPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestID } = req.params;

    const statusResponse = await mpesaService.querySTKStatus(checkoutRequestID);

    res.json({
      success: true,
      data: statusResponse
    });
  } catch (error) {
    console.error('Query payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to query payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Timeout handler
export const mpesaTimeout = async (req, res) => {
  try {
    console.log('M-Pesa Timeout:', JSON.stringify(req.body, null, 2));

    const { CheckoutRequestID } = req.body;

    // Find and update order
    const order = await Order.findOne({
      'paymentInfo.transactionId': CheckoutRequestID
    });

    if (order) {
      order.paymentInfo.status = 'failed';
      await order.save();
    }

    res.status(200).json({ message: 'Timeout processed successfully' });
  } catch (error) {
    console.error('M-Pesa timeout error:', error);
    res.status(500).json({ message: 'Timeout processing failed' });
  }
};
```

### 3. Payment Routes

Create `server/src/routes/payments.js`:

```javascript
import express from 'express';
import { body } from 'express-validator';
import {
  initiateMpesaPayment,
  mpesaCallback,
  queryPaymentStatus,
  mpesaTimeout
} from '../controllers/paymentController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const initiatePaymentValidation = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('phoneNumber')
    .matches(/^(\+254|254|0)[17]\d{8}$/)
    .withMessage('Please provide a valid Kenyan phone number')
];

// Routes
router.post('/mpesa/initiate', auth, initiatePaymentValidation, validate, initiateMpesaPayment);
router.post('/mpesa/callback', mpesaCallback);
router.post('/mpesa/timeout', mpesaTimeout);
router.get('/mpesa/status/:checkoutRequestID', auth, queryPaymentStatus);

export default router;
```

## Frontend Integration

### 1. Payment Service

Create `client/src/services/paymentService.js`:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const paymentService = {
  // Initiate M-Pesa payment
  async initiateMpesaPayment(orderId, phoneNumber) {
    try {
      const response = await axios.post(`${API_URL}/payments/mpesa/initiate`, {
        orderId,
        phoneNumber
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Query payment status
  async queryPaymentStatus(checkoutRequestID) {
    try {
      const response = await axios.get(`${API_URL}/payments/mpesa/status/${checkoutRequestID}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
```

### 2. Payment Hook

Create `client/src/hooks/usePayment.js`:

```javascript
import { useState } from 'react';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const initiateMpesaPayment = async (orderId, phoneNumber) => {
    setIsProcessing(true);
    try {
      const response = await paymentService.initiateMpesaPayment(orderId, phoneNumber);
      
      if (response.success) {
        toast.success('Payment request sent to your phone');
        
        // Start polling for payment status
        pollPaymentStatus(response.data.checkoutRequestID);
        
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error.message || 'Payment initiation failed');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestID) => {
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await paymentService.queryPaymentStatus(checkoutRequestID);
        
        if (response.data.ResultCode === '0') {
          // Payment successful
          setPaymentStatus('completed');
          toast.success('Payment completed successfully!');
          return;
        } else if (response.data.ResultCode !== '1032') {
          // Payment failed (1032 means still pending)
          setPaymentStatus('failed');
          toast.error('Payment failed. Please try again.');
          return;
        }

        // Continue polling if still pending
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setPaymentStatus('timeout');
          toast.error('Payment timeout. Please check your M-Pesa messages.');
        }
      } catch (error) {
        console.error('Payment status polling error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        }
      }
    };

    poll();
  };

  return {
    initiateMpesaPayment,
    isProcessing,
    paymentStatus,
    setPaymentStatus
  };
};
```

## Testing

### 1. Sandbox Testing
Use these test credentials for sandbox testing:

**Test Phone Numbers:**
- `254708374149`
- `254711XXXXXX`
- `254733XXXXXX`

**Test Amounts:**
- Any amount between 1 and 70,000 KES

### 2. Test Flow
1. Create an order in your application
2. Initiate M-Pesa payment with test phone number
3. You'll receive an STK Push prompt on the test number
4. Enter your M-Pesa PIN (use any 4-digit PIN for sandbox)
5. Payment will be processed and callback will be triggered

## Production Deployment

### 1. Switch to Production
1. Change `MPESA_ENVIRONMENT` to `production`
2. Update all URLs to production endpoints
3. Use your production shortcode and passkey
4. Ensure your callback URL is publicly accessible and uses HTTPS

### 2. Security Considerations
- Always validate callback data
- Implement proper error handling
- Log all transactions for audit purposes
- Use HTTPS for all callback URLs
- Implement rate limiting on payment endpoints

### 3. Monitoring
- Monitor callback success rates
- Track failed payments
- Set up alerts for payment issues
- Regularly reconcile payments with M-Pesa statements

## Troubleshooting

### Common Issues

1. **Invalid Access Token**
   - Check consumer key and secret
   - Ensure credentials are for correct environment

2. **STK Push Not Received**
   - Verify phone number format
   - Check if phone number is registered for M-Pesa
   - Ensure amount is within limits

3. **Callback Not Received**
   - Verify callback URL is accessible
   - Check firewall settings
   - Ensure URL uses HTTPS in production

4. **Payment Timeout**
   - Increase timeout duration
   - Implement retry mechanism
   - Provide manual verification option

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=mpesa:*
```

This comprehensive guide should help you successfully integrate M-Pesa payments into your Andan Grocery system.