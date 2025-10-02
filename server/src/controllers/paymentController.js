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
    // Parse the JSON data from the request body
    const callbackData = req.body;
    
    // Log the full callback data for debugging
    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    // Extract the nested callback data from Safaricom's payload structure
    // The callback comes in this format: { Body: { stkCallback: { ... } } }
    const { Body } = callbackData;
    const { stkCallback } = Body;

    // Extract the main callback properties
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback;

    // Check if the transaction was successful (ResultCode 0 means success)
    if (ResultCode === 0) {
      // Transaction successful - extract payment details from CallbackMetadata
      const metadata = CallbackMetadata?.Item || [];
      
      // Find specific payment details in the metadata array
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;

      // Log successful transaction details as required
      console.log('✅ M-Pesa Payment Successful:');
      console.log(`   MpesaReceiptNumber: ${mpesaReceiptNumber}`);
      console.log(`   Amount: ${amount}`);
      console.log(`   PhoneNumber: ${phoneNumber}`);
      console.log(`   TransactionDate: ${transactionDate}`);
      console.log(`   ResultDesc: ${ResultDesc}`);
      console.log(`   MerchantRequestID: ${MerchantRequestID}`);

      // Update order in database if found
      const order = await Order.findOne({
        'paymentInfo.transactionId': CheckoutRequestID
      });

      if (order) {
        // Update order payment status
        order.paymentInfo.status = 'completed';
        order.paymentInfo.mpesaReceiptNumber = mpesaReceiptNumber;
        order.paymentInfo.paidAt = new Date();
        order.status = 'confirmed';
        await order.save();
        console.log(`   Order ${order.orderNumber} updated successfully`);
      } else {
        console.log(`   Warning: Order not found for CheckoutRequestID: ${CheckoutRequestID}`);
      }

    } else {
      // Transaction failed - log the failure reason
      console.log('❌ M-Pesa Payment Failed:');
      console.log(`   ResultDesc: ${ResultDesc}`);
      console.log(`   ResultCode: ${ResultCode}`);
      console.log(`   MerchantRequestID: ${MerchantRequestID}`);

      // Update order status if found
      const order = await Order.findOne({
        'paymentInfo.transactionId': CheckoutRequestID
      });

      if (order) {
        order.paymentInfo.status = 'failed';
        await order.save();
        console.log(`   Order ${order.orderNumber} marked as failed`);
      }
    }

    // Immediately send back the required response format
    // This is critical - Safaricom expects this exact response
    res.status(200).json({ 
      "C2BPaymentConfirmationResult": "Success" 
    });

  } catch (error) {
    // Log any errors that occur during processing
    console.error('❌ M-Pesa callback processing error:', error);
    
    // Still send back the required response even if there's an error
    // This prevents Safaricom from retrying the callback
    res.status(200).json({ 
      "C2BPaymentConfirmationResult": "Success" 
    });
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