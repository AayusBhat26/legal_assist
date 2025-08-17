/**
 * Payment Gateway Configuration
 * Handles both real and mock payment gateways
 */

import MockPaymentGateway from './mockPaymentGateway';

class PaymentGatewayManager {
  constructor() {
    this.paymentsEnabled = process.env.PAYMENTS_ENABLED === 'true';
    this.useRazorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;
    
    if (this.paymentsEnabled && this.useRazorpay) {
      // Use real Razorpay
      const Razorpay = require('razorpay');
      this.gateway = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
      this.gatewayType = 'razorpay';
    } else {
      // Use mock payment gateway
      this.gateway = new MockPaymentGateway();
      this.gatewayType = 'mock';
    }
  }

  async createOrder(amount, currency = 'INR', options = {}) {
    if (this.gatewayType === 'razorpay') {
      return await this.gateway.orders.create({
        amount: amount * 100, // Convert to paise
        currency: currency,
        ...options
      });
    } else {
      return await this.gateway.createOrder(amount, currency, options);
    }
  }

  async verifyPayment(paymentId, orderId, signature) {
    if (this.gatewayType === 'razorpay') {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + '|' + paymentId)
        .digest('hex');
      
      return {
        success: expectedSignature === signature,
        paymentId,
        orderId,
        signature
      };
    } else {
      return await this.gateway.verifyPayment(paymentId, orderId, signature);
    }
  }

  getCheckoutOptions(order, userDetails = {}) {
    if (this.gatewayType === 'razorpay') {
      return {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Legal Assistance Platform',
        description: 'Legal consultation payment',
        order_id: order.id,
        prefill: {
          name: userDetails.name || '',
          email: userDetails.email || '',
          contact: userDetails.phone || ''
        },
        theme: {
          color: '#3399cc'
        }
      };
    } else {
      return this.gateway.getCheckoutOptions(order, userDetails);
    }
  }

  isPaymentsEnabled() {
    return this.paymentsEnabled;
  }

  getGatewayType() {
    return this.gatewayType;
  }
}

const paymentGatewayManager = new PaymentGatewayManager();
export default paymentGatewayManager;
