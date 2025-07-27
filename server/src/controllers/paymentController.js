import mpesaService from '../services/mpesaServices.js';
import { Order } from '../models/Order.js';

// Initiate M-Pesa payment
export const initiateMpesaPayment = async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body;
    if (!orderId || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'orderId and phoneNumber are required' });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const stkResponse = await mpesaService.stkPush(
      phoneNumber,
      order.totalPrice,
      order.orderNumber,
      `Payment for order ${order.orderNumber}`
    );
    // Optionally update order with transactionId
    order.paymentInfo.transactionId = stkResponse.CheckoutRequestID;
    order.paymentInfo.method = 'mpesa';
    await order.save();
    res.json({ success: true, message: 'Payment initiated successfully', data: stkResponse });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate payment' });
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