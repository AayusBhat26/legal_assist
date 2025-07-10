/**
 * Mock Payment System for Development
 * This simulates payment processing without real money
 */

export class MockPaymentGateway {
  constructor() {
    this.isTestMode = true;
    this.gatewayName = 'Mock Payment Gateway';
  }

  // Simulate creating a payment order
  async createOrder(amount, currency = 'INR', options = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: orderId,
      amount: amount * 100, // Convert to paise (like Razorpay)
      currency: currency,
      status: 'created',
      created_at: new Date().toISOString(),
      ...options
    };
  }

  // Simulate payment verification
  async verifyPayment(paymentId, orderId, signature) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock verification - always returns success in test mode
    return {
      success: true,
      paymentId: paymentId,
      orderId: orderId,
      signature: signature,
      status: 'paid',
      method: 'mock_payment'
    };
  }

  // Simulate payment capture
  async capturePayment(paymentId, amount) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      paymentId: paymentId,
      amount: amount,
      status: 'captured',
      captured_at: new Date().toISOString()
    };
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: paymentId,
      amount: 50000, // Mock amount
      currency: 'INR',
      status: 'paid',
      method: 'mock_payment',
      created_at: new Date().toISOString(),
      captured: true
    };
  }

  // Generate checkout options for frontend
  getCheckoutOptions(order, userDetails = {}) {
    return {
      key: 'mock_key_id',
      amount: order.amount,
      currency: order.currency,
      name: 'Legal Assistance Platform',
      description: 'Legal consultation payment',
      order_id: order.id,
      handler: function(response) {
        // This will be handled by the frontend
        console.log('Mock payment successful:', response);
      },
      prefill: {
        name: userDetails.name || 'Test User',
        email: userDetails.email || 'test@example.com',
        contact: userDetails.phone || '9999999999'
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: function() {
          console.log('Mock payment dismissed');
        }
      }
    };
  }
}

// Default export for easy importing
export default MockPaymentGateway;

// Usage example:
/*
import MockPaymentGateway from './mockPaymentGateway';

const paymentGateway = new MockPaymentGateway();

// Create order
const order = await paymentGateway.createOrder(500, 'INR');

// Verify payment
const verification = await paymentGateway.verifyPayment(
  'mock_payment_id',
  order.id,
  'mock_signature'
);
*/
