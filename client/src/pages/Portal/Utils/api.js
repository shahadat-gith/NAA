import { toast } from "react-hot-toast";

export const fetchStudentDetails = async (backendUrl, studentId, adminToken) => {
  const response = await fetch(`${backendUrl}/api/students/${studentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch student details");
  }
  return data.student;
};

export const fetchPaymentDetails = async (backendUrl, studentId, paymentId, adminToken) => {
  const response = await fetch(`${backendUrl}/api/students/${studentId}/payments/${paymentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch payment details");
  }
  return data.payment;
};

export const processPayment = async (backendUrl, student, amount, config, adminToken) => {
  const orderBody = {
    studentId: student._id,
    amount,
    paymentType: config.paymentType,
    feeType: config.feeType || config.paymentType,
    month: config.paymentType === "monthlyfee" ? new Date().toISOString().slice(0, 7) : undefined,
  };

  console.log("Payment request:", orderBody);

  const orderResponse = await fetch(`${backendUrl}/api/students/${student._id}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(orderBody),
  });

  const orderData = await orderResponse.json();
  if (!orderResponse.ok || !orderData.success) {
    throw new Error(orderData.message || "Failed to create payment order");
  }

  const { orderId, amount: orderAmount, key } = orderData;
  if (!key) {
    console.error("Razorpay key missing in response:", orderData);
    throw new Error("Payment configuration error: Authentication key missing");
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      const options = {
        key,
        amount: orderAmount,
        currency: "INR",
        name: "School Payment Portal",
        description: `${config.receiptLabel || "Fee Payment"} for ${student.name}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyBody = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              studentId: student._id,
              amount,
              paymentType: config.paymentType,
              feeType: config.feeType || config.paymentType,
              month: orderBody.month,
            };

            const verifyResponse = await fetch(`${backendUrl}${config.verifyUrl}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
              body: JSON.stringify(verifyBody),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.message || "Payment verification failed");
            }

            resolve(verifyData.student);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: student.name,
          email: student.email || "student@example.com",
          contact: student.contact || "9999999999",
        },
        theme: {
          color: "#e94560",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response);
        reject(new Error(response.error.description || "Payment failed"));
      });
      rzp.open();
    };

    script.onerror = () => {
      reject(new Error("Failed to load Razorpay SDK"));
    };

    document.body.appendChild(script);
  });
};