import { toast } from "react-toastify";

export const fetchTransactions = async (studentId, studentToken, backendUrl, setTransactions) => {
  try {
    const response = await fetch(`${backendUrl}/api/student/transactions/${studentId}`);
    const data = await response.json();
    if (data.success) {
      console.log("Fetched transactions:", data.transactions);
      setTransactions(data.transactions);
    } else {
      console.error("Failed to fetch transactions:", data.message);
      setTransactions([]);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    setTransactions([]);
  }
};

export const handleRazorpayPayment = async (
  student,
  studentToken,
  backendUrl,
  transactions,
  setModal,
  fetchTransactions
) => {
  // Check if Razorpay is available (from index.html script)
  if (!window.Razorpay) {
    toast.error("Payment gateway not loaded. Please refresh the page and try again.");
    return;
  }

  try {
    const keyResponse = await fetch(`${backendUrl}/api/v1/payment/get-key`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const keyData = await keyResponse.json();
    const razorpayKey = keyData.key;

    const amountInRupees = transactions.length > 0 ? Number(transactions[0].amount) : 1000;

    const orderResponse = await fetch(`${backendUrl}/api/v1/payment/process-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        amount: amountInRupees,
        studentId: student._id,
      }),
    });
    const orderData = await orderResponse.json();

    if (!orderData.success) {
      toast.error(orderData.message || "Failed to create payment order");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: orderData.amount,
      currency: "INR",
      name: "Nashib Ali Academy",
      description: "Admission Fee Payment",
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          const verifyResponse = await fetch(`${backendUrl}/api/v1/payment/payment-success`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${studentToken}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              studentId: student._id,
              amount: amountInRupees,
            }),
          });
          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            await fetchTransactions();
            setModal({
              isOpen: true,
              type: "success",
              message: `Payment of ₹${amountInRupees} successful!`,
              paymentId: response.razorpay_payment_id,
            });
          } else {
            setModal({
              isOpen: true,
              type: "failure",
              message: verifyData.message || "Payment verification failed",
              paymentId: "",
            });
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          setModal({
            isOpen: true,
            type: "failure",
            message: "Something went wrong while processing your payment.",
            paymentId: "",
          });
        }
      },
      prefill: {
        name: student.name,
        email: student.email,
        contact: student.phone || "",
      },
      theme: {
        color: "#3399cc",
        hide_topbar: true,
      },
      modal: {
        ondismiss: function () {
          setModal({
            isOpen: true,
            type: "failure",
            message: "Payment was cancelled or closed.",
            paymentId: "",
          });
        },
        animation: true,
      },
      notes: {
        suppress_default_success: true,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      setModal({
        isOpen: true,
        type: "failure",
        message: response.error.description || "Payment failed.",
        paymentId: "",
      });
    });

    paymentObject.on("payment.success", () => {
      paymentObject.close();
    });
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Something went wrong with the payment");
  }
};