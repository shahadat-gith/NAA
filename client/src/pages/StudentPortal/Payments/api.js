export const searchStudents = async (backendUrl, searchTerm, searchUrl) => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) throw new Error("Please enter a search term");
  
    const searchParams = {};
    const cleanTerm = trimmedTerm.replace(/\s+/g, "");
    if (/^\d+$/.test(cleanTerm)) {
      if (cleanTerm.length === 10) searchParams.phone = cleanTerm;
      else if (cleanTerm.length === 12) searchParams.aadhar = cleanTerm;
      else searchParams.rollNo = trimmedTerm;
    } else {
      searchParams.name = trimmedTerm;
    }
  
    const queryString = Object.entries(searchParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    const url = `${backendUrl}${searchUrl}?${queryString}`;
  
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Search failed");
    if (!data.success) throw new Error(data.message || "No students found");
    return data.data;
  };
  
  export const fetchStudentDetails = async (backendUrl, studentId) => {
    const response = await fetch(`${backendUrl}/api/students/${studentId}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch updated details");
    if (!data.success) throw new Error(data.message || "No student found");
    return data.data;
  };
  
  export const fetchLatestTransactionDetails = async (backendUrl, studentId) => {
    const response = await fetch(`${backendUrl}/api/students/${studentId}`);
    const data = await response.json();
    if (response.ok && data.success) {
      const payments = data.data.payments || [];
      return payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))[0] || null;
    }
    return null;
  };
  
  export const processPayment = async (backendUrl, student, amount, config) => {
    const currentMonth =
      config.paymentType === "monthlyfee" || config.paymentType === "hosteladmissionfee"
        ? `${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`
        : null;
  
    const orderBody = {
      studentId: student._id,
      amount: parseInt(amount),
      paymentType: config.paymentType,
      paymentMode: "online",
      ...(currentMonth && { month: currentMonth }),
    };
  
    const orderResponse = await fetch(`${backendUrl}${config.recordUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderBody),
    });
    const orderData = await orderResponse.json();
    if (!orderResponse.ok) throw new Error(orderData.message || "Failed to create order");
  
    return new Promise((resolve, reject) => {
      const options = {
        key: orderData.data?.key || orderData.key,
        amount: orderData.data?.amount || parseInt(amount) * 100,
        currency: "INR",
        order_id: orderData.data?.orderId || orderData.orderId,
        name: "Nashib Ali Academy",
        description: `Payment for ${student.firstName} ${student.lastName}`,
        handler: async (response) => {
          const verifyBody = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            studentId: student._id,
            amount: parseInt(amount),
            paymentType: config.paymentType,
            ...(currentMonth && { month: currentMonth }),
          };
  
          const verifyResponse = await fetch(`${backendUrl}${config.verifyUrl}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(verifyBody),
          });
          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok) throw new Error(verifyData.message || "Payment verification failed");
  
          const updatedStudent = await fetchStudentDetails(backendUrl, student._id);
          resolve(updatedStudent);
        },
        prefill: {
          name: `${student.firstName} ${student.lastName}`,
          contact: student.guardianContact || student.phone || "",
        },
        theme: { color: "#4F46E5" },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => reject(new Error("Payment failed")));
      rzp.open();
    });
  };