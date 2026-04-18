// src/services/paymentService.js
import api from './api';

export const PLANS = {
  premium_monthly: { label: 'Premium Monthly', price: 199, description: 'Full access for 1 month' },
  premium_yearly:  { label: 'Premium Yearly',  price: 1799, description: 'Full access for 12 months — Save 25%' },
  consultation:    { label: 'Doctor Consultation', price: 500, description: '30-min in-person/video consult' },
  instant_video:   { label: 'Instant Video Call',  price: 299, description: 'Connect with a doctor now' },
};

export const initiatePayment = async ({ type, doctorId, scheduledAt, userData }) => {
  // 1. Create order on backend
  const { data } = await api.post('/payments/create-order', { type, doctorId });
  const { order, key } = data;

  // 2. Open Razorpay checkout
  return new Promise((resolve, reject) => {
    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: 'HerHealth',
      description: PLANS[type]?.label || 'Payment',
      image: '/logo.png',
      order_id: order.id,
      prefill: {
        name:  userData?.name  || '',
        email: userData?.email || '',
      },
      theme: { color: '#E8647A' },
      modal: { ondismiss: () => reject(new Error('Payment cancelled by user')) },
      handler: async (response) => {
        try {
          // 3. Verify payment on backend
          const verify = await api.post('/payments/verify', {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            paymentId: data.paymentId,
            scheduledAt,
          });
          resolve(verify.data);
        } catch (err) {
          reject(err);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (resp) => reject(new Error(resp.error.description)));
    rzp.open();
  });
};
