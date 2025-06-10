import { toast } from 'react-hot-toast';

const initiateRazorpayPayment = async ({
  orderData,
  studentData,
  amount,
  onSuccess,
  onError,
}) => {
  // Since Razorpay script is already in index.html, we don’t need to load it dynamically
  if (!window.Razorpay) {
    toast.error('Razorpay SDK not loaded. Please check your index.html.');
    return;
  }

  const options = {
    key: orderData.data?.key || orderData.key, // Handle both response structures
    amount: orderData.data?.transaction?.amount * 100 || orderData.amount || amount * 100, // Convert to paise
    currency: 'INR',
    order_id: orderData.data?.orderId || orderData.orderId,
    name: 'Nashib Ali Academy',
    description: `Payment for ${studentData.name}`,
    handler: async (response) => {
      try {
        await onSuccess(response); // Call the component-specific success handler
      } catch (err) {
        onError(err); // Call the component-specific error handler
      }
    },
    prefill: {
      name: studentData.name,
      contact: studentData.phone || '', 
    },
    theme: { color: 'blue' },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

export default initiateRazorpayPayment;