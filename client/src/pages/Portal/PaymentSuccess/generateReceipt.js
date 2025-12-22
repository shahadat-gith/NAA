import jsPDF from "jspdf";

export const generateReceipt = (payment, student) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const primaryColor = [233, 69, 96]; // #e94560
    const darkColor = [44, 62, 80]; // #2c3e50
    const lightGray = [127, 140, 141]; // #7f8c8d

    // Header Background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");

    // School Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Nashib Ali Academy", pageWidth / 2, 15, { align: "center" });

    // Receipt Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Receipt", pageWidth / 2, 28, { align: "center" });

    // Receipt Number & Date Box
    doc.setFillColor(245, 247, 250);
    doc.rect(10, 45, pageWidth - 20, 20, "F");
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Receipt No:", 15, 53);
    doc.setFont("helvetica", "normal");
    doc.text(payment._id || "N/A", 45, 53);

    doc.setFont("helvetica", "bold");
    doc.text("Date:", 15, 60);
    doc.setFont("helvetica", "normal");
    const receiptDate = new Date(payment.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    doc.text(receiptDate, 45, 60);

    // Student Details Section
    let yPos = 75;
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.rect(10, yPos, pageWidth - 20, 8, "F");
    doc.text("STUDENT DETAILS", 15, yPos + 6);

    yPos += 15;
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);

    // Student Info
    const studentInfo = [
      { label: "Name", value: student.name },
      { label: "Registration No", value: student.registrationNo },
      { label: "Class", value: student.class },
      { label: "Medium", value: student.medium },
    ];

    if (student.stream) {
      studentInfo.push({ label: "Stream", value: student.stream });
    }

    studentInfo.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.text(item.label + ":", 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(item.value, 60, yPos);
      yPos += 7;
    });

    // Payment Details Section
    yPos += 8;
    doc.setFillColor(...primaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.rect(10, yPos, pageWidth - 20, 8, "F");
    doc.text("PAYMENT DETAILS", 15, yPos + 6);

    yPos += 15;
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);

    // Payment Info
    const paymentInfo = [
      { 
        label: "Fee Type", 
        value: payment.feeType.replace(/([A-Z])/g, " $1").trim() 
      },
      { label: "Academic Session", value: payment.academicSession },
      { label: "Payment Mode", value: payment.paymentMode },
      { label: "Transaction ID", value: payment.razorpayPaymentId },
    ];

    if (payment.month) {
      paymentInfo.splice(1, 0, { label: "Month", value: payment.month });
    }

    paymentInfo.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.text(item.label + ":", 15, yPos);
      doc.setFont("helvetica", "normal");
      
      // Handle long transaction ID
      if (item.label === "Transaction ID") {
        const maxWidth = pageWidth - 75;
        const lines = doc.splitTextToSize(item.value, maxWidth);
        doc.text(lines, 60, yPos);
        yPos += (lines.length - 1) * 5;
      } else {
        doc.text(item.value, 60, yPos);
      }
      yPos += 7;
    });

    // Amount Box (Highlighted)
    yPos += 5;
    doc.setFillColor(255, 245, 247);
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.rect(10, yPos, pageWidth - 20, 18, "FD");

    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount Paid:", 15, yPos + 12);
    doc.setFontSize(16);
    doc.text("₹ " + payment.amount, pageWidth - 15, yPos + 12, { align: "right" });

    // Footer
    yPos = pageHeight - 30;
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.line(10, yPos, pageWidth - 10, yPos);

    doc.setTextColor(...lightGray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This is a computer-generated receipt and does not require a signature.",
      pageWidth / 2,
      yPos + 8,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.text(
      "For any queries, please contact the school office.",
      pageWidth / 2,
      yPos + 14,
      { align: "center" }
    );

    // Thank You Message
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Thank you for your payment!",
      pageWidth / 2,
      yPos + 22,
      { align: "center" }
    );

    // Generate filename
    const filename = `Receipt_${student.registrationNo}_${payment.feeType}_${Date.now()}.pdf`;

    // Save PDF
    doc.save(filename);

    return true;
  } catch (error) {
    console.error("Error generating receipt:", error);
    return false;
  }
};