import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import principalSignature from "/principal_sign.png"; // Adjust path
import examIcSignature from "/exam_ic_sign.png"; // Adjust path

// Helper function to capitalize name
const capitalizeName = (name) => {
    if (!name) return "";
    return name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

// Helper function to calculate grade based on marks
export const calculateGrade = (marks) => {
    try {
        const marksNum = parseInt(marks);
        if (isNaN(marksNum)) return "NA";
        if (marksNum >= 90) return "A+";
        if (marksNum >= 80) return "A";
        if (marksNum >= 70) return "B+";
        if (marksNum >= 60) return "B";
        if (marksNum >= 50) return "C+";
        if (marksNum >= 40) return "C";
        return "F";
    } catch (e) {
        console.error("Error calculating grade:", e);
        return "ERROR";
    }
};

// Helper function to calculate overall grade
const calculateOverallGrade = (percentage) => {
    try {
        const percentNum = parseFloat(percentage);
        if (isNaN(percentNum)) return "N/A";
        if (percentNum >= 90) return "A+ (Outstanding)";
        if (percentNum >= 80) return "A (Excellent)";
        if (percentNum >= 70) return "B+ (Very Good)";
        if (percentNum >= 60) return "B (Good)";
        if (percentNum >= 50) return "C+ (Above Average)";
        if (percentNum >= 40) return "C (Average)";
        return "F (Fail)";
    } catch (e) {
        console.error("Error calculating overall grade:", e);
        return "ERROR";
    }
};

export const generateResultPDF = (resultData) => { // Define and export the main function to generate the PDF
    try { // Start a try-catch block to handle PDF generation errors
        const doc = new jsPDF({ // Create a new jsPDF instance
            orientation: "portrait", // Set page orientation to portrait
            unit: "mm", // Use millimeters as the unit of measurement
            format: "a4", // Set page size to A4 (210mm x 297mm)
        });

        // --- Background ---
        doc.setFillColor(248, 249, 250); // Set fill color to light gray (RGB: 248, 249, 250)
        doc.rect(0, 0, 210, 297, "F"); // Draw a filled rectangle covering the entire page (X: 0, Y: 0, W: 210mm, H: 297mm)

        // --- Header ---
        doc.setFillColor(70, 130, 180); // Set fill color to steel blue (RGB: 70, 130, 180)
        doc.rect(0, 0, 210, 30, "F"); // Draw a filled rectangle for the header (X: 0, Y: 0, W: 210mm, H: 30mm)
        doc.setTextColor(255, 255, 255); // Set text color to white (RGB: 255, 255, 255)
        doc.setFont("helvetica", "bold"); // Set font to Helvetica, bold variant
        doc.setFontSize(18); // Set font size to 18pt for the school name
        doc.text("Nashib Ali Academy", 105, 12, { align: "center" }); // Add school name at X: 105mm (center), Y: 12mm
        doc.setFontSize(12); // Set font size to 12pt for the exam title
        doc.text("Annual Examination 2025", 105, 20, { align: "center" }); // Add exam title at X: 105mm, Y: 20mm
        doc.setFontSize(10); // Set font size to 10pt for "Report Card"
        doc.text("Report Card", 105, 25, { align: "center" }); // Add "Report Card" at X: 105mm, Y: 25mm
        doc.setDrawColor(255, 255, 255); // Set line color to white (RGB: 255, 255, 255)
        doc.setLineWidth(0.3); // Set line width to 0.3mm for the decorative line
        doc.line(50, 27, 160, 27); // Draw a horizontal line from X: 50mm to 160mm at Y: 27mm

        // --- Student Details Box ---
        doc.setFillColor(255, 255, 255); // Set fill color to white (RGB: 255, 255, 255)
        doc.roundedRect(20, 35, 170, 35, 3, 3, "F"); // Draw a filled rounded rectangle (X: 20mm, Y: 35mm, W: 170mm, H: 35mm, radius: 3mm)
        doc.setDrawColor(220, 220, 220); // Set border color to light gray (RGB: 220, 220, 220)
        doc.setLineWidth(0.2); // Set border line width to 0.2mm
        doc.roundedRect(20, 35, 170, 35, 3, 3, "S"); // Draw the border of the rounded rectangle (stroke only)

        doc.setTextColor(70, 70, 70); // Set text color to dark gray (RGB: 70, 70, 70)
        doc.setFontSize(12); // Set font size to 12pt for the title
        doc.setFont("helvetica", "bold"); // Set font to Helvetica, bold
        doc.text("Student Information", 25, 42); // Add "Student Information" title at X: 25mm, Y: 42mm
        doc.setDrawColor(70, 130, 180); // Set line color to steel blue (RGB: 70, 130, 180)
        doc.setLineWidth(0.3); // Set line width to 0.3mm for the underline
        doc.line(25, 44, 70, 44); // Draw underline from X: 25mm to 70mm at Y: 44mm

        doc.setFontSize(10); // Set font size to 10pt for student details
        doc.setFont("helvetica", "normal"); // Set font to Helvetica, normal variant
        const leftCol = 25; // Define left column X-position at 25mm
        const rightCol = 110; // Define right column X-position at 110mm

        if (resultData && resultData.name) { // Check if resultData exists and has a name property
            const capitalizedName = capitalizeName(resultData.name); // Capitalize the student's name
            doc.text(`Name: ${capitalizedName}`, leftCol, 50); // Add name at X: 25mm, Y: 50mm
            doc.text(`Class: ${resultData.class || "N/A"}`, leftCol, 58); // Add class at X: 25mm, Y: 58mm, default to "N/A" if missing
            doc.text(`Roll Number: ${resultData.rollNumber || "N/A"}`, rightCol, 50); // Add roll number at X: 110mm, Y: 50mm
            doc.text(`Medium: ${resultData.medium || "N/A"}`, rightCol, 58); // Add medium at X: 110mm, Y: 58mm
            if (resultData.class && parseInt(resultData.class) > 10 && resultData.stream) { // Check if class > 10 and stream exists
                doc.text(`Stream: ${resultData.stream}`, leftCol, 66); // Add stream at X: 25mm, Y: 66mm
            }
        } else { // If resultData or name is missing
            doc.text("Error: Student data not available", leftCol, 50); // Display error message at X: 25mm, Y: 50mm
            return; // Exit the function early
        }

        // --- Marks Table Title --- (Increased margin between student details and this section)
        // Added 10mm additional margin (from 75 to 85)
        doc.setTextColor(70, 70, 70); // Set text color to dark gray (RGB: 70, 70, 70) for consistency with other titles
        doc.setFontSize(12); // Set font size to 12pt, matching "Student Information" title size
        doc.setFont("helvetica", "bold"); // Set font to Helvetica bold to emphasize the section heading
        doc.text("Subject-wise Performance", 25, 80); // Add "Subject-wise Performance" title at X: 25mm, Y: 85mm (increased from 75mm)
        doc.setDrawColor(70, 130, 180); // Set line color to steel blue (RGB: 70, 130, 180) for the underline
        doc.setLineWidth(0.3); // Set line width to 0.3mm, matching other underlines in the document
        doc.line(25, 87, 70, 87); // Draw underline from X: 25mm to 70mm at Y: 87mm (increased from 77mm)

        // --- Marks Table --- (Increased margin between title and table)
        // Added 4mm additional margin (from 81 to 91)
        autoTable(doc, { // Start an autoTable instance to create the marks table
            startY: 91, // Set table starting Y-position to 91mm (increased from 81mm)
            head: [["Subject", "Maximum Marks", "Marks Obtained", "Grade"]], // Define table header row with four columns
            body: Object.entries(resultData.marks || {}).map(([subject, mark]) => [ // Generate table body from marks data
                subject, // First column: subject name
                100, // Second column: maximum marks (fixed at 100)
                mark, // Third column: marks obtained
                calculateGrade(mark), // Fourth column: grade calculated from marks
            ]),
            headStyles: { // Styles for the table header
                fillColor: [70, 130, 180], // Set header background to steel blue (RGB: 70, 130, 180)
                textColor: 255, // Set header text color to white (RGB: 255, 255, 255)
                fontStyle: "bold", // Make header text bold
                halign: "center", // Center-align header text
                fontSize: 10, // Set header font size to 10pt
            },
            alternateRowStyles: { // Styles for alternating rows
                fillColor: [240, 245, 255] // Set even rows to light blue (RGB: 240, 245, 255)
            },
            styles: { // General table styles
                fontSize: 10, // Set body font size to 10pt
                cellPadding: 4, // Set cell padding to 4mm for row height
                lineColor: [200, 200, 200], // Set border color to light gray (RGB: 200, 200, 200)
                lineWidth: 0.1 // Set border thickness to 0.1mm
            },
            columnStyles: { // Specific styles for each column
                0: { fontStyle: "bold", cellWidth: "auto" }, // Subject column: bold text, auto-width
                1: { halign: "center" }, // Maximum Marks column: center-aligned
                2: { halign: "center" }, // Marks Obtained column: center-aligned
                3: { halign: "center" }, // Grade column: center-aligned
            },
            margin: { left: 20, right: 20 }, // Set left and right margins to 20mm to match page layout
        });

        // --- Summary ---
        let summaryY = doc.lastAutoTable.finalY + 5; // Calculate summary Y-position, 5mm below the table's end
        doc.setFillColor(240, 248, 255); // Set fill color to light blue (RGB: 240, 248, 255)
        doc.roundedRect(20, summaryY, 170, 25, 3, 3, "F"); // Draw filled rounded rectangle (X: 20mm, Y: summaryY, W: 170mm, H: 25mm)
        doc.setDrawColor(70, 130, 180); // Set border color to steel blue (RGB: 70, 130, 180)
        doc.setLineWidth(0.2); // Set border line width to 0.2mm
        doc.roundedRect(20, summaryY, 170, 25, 3, 3, "S"); // Draw the border of the summary box

        doc.setTextColor(70, 70, 70); // Set text color to dark gray (RGB: 70, 70, 70)
        doc.setFontSize(10); // Set font size to 10pt for summary text
        doc.setFont("helvetica", "bold"); // Set font to Helvetica bold
        const col1 = 25; // Define first column X-position at 25mm
        const col2 = 80; // Define second column X-position at 80mm
        const col3 = 135; // Define third column X-position at 135mm
        const summaryTextY = summaryY + 8; // Calculate text Y-position, 8mm below summaryY for internal spacing

        if ( // Check if required summary data exists
            resultData.totalMarks !== undefined &&
            resultData.maxTotalMarks !== undefined &&
            resultData.percentage !== undefined
        ) {
            doc.text(`Total: ${resultData.totalMarks}/${resultData.maxTotalMarks}`, col1, summaryTextY); // Add total marks at X: 25mm
            doc.text(`%: ${resultData.percentage}`, col2, summaryTextY); // Add percentage at X: 80mm
            const isPassed = resultData.percentage >= 40; // Determine if student passed (40% or higher)
            doc.setTextColor(...(isPassed ? [46, 125, 50] : [198, 40, 40])); // Set text color to green (PASS) or red (FAIL)
            doc.text(`Result: ${isPassed ? "PASS" : "FAIL"}`, col3, summaryTextY); // Add result at X: 135mm
            doc.setTextColor(70, 70, 70); // Reset text color to dark gray
            doc.text("Grade:", col1, summaryTextY + 12); // Add "Grade:" label at X: 25mm, 12mm below previous text
            doc.setFontSize(11); // Set font size to 11pt for the grade value
            doc.text(calculateOverallGrade(resultData.percentage), col1 + 25, summaryTextY + 12); // Add overall grade 25mm right of "Grade:"
        }

        // --- Signatures ---
        const contentEndY = summaryY + 25; // Calculate end of content (bottom of summary box)
        const footerHeight = 15; // Define footer height as 15mm
        const signatureSpace = 45; // Define total height for signatures and names as 45mm
        const availableSpace = 297 - footerHeight - contentEndY; // Calculate remaining space on page
        let signatureY = contentEndY + Math.max(5, availableSpace - signatureSpace); // Position signatures, ensuring at least 5mm gap

        doc.setFontSize(10); // Set font size to 10pt for signature text
        doc.setFont("helvetica", "normal"); // Set font to Helvetica normal
        doc.setFont("helvetica", "bold"); // Set font to Helvetica bold for titles

        const examIcX = 40; // Define Exam In-Charge X-position at 40mm
        doc.text("Exam In-Charge", examIcX, signatureY); // Add "Exam In-Charge" title at X: 40mm
        if (examIcSignature) { // Check if exam in-charge signature image exists
            try { // Start a try-catch block for image addition
                doc.addImage(examIcSignature, "PNG", examIcX - 10, signatureY + 3, 40, 15); // Add signature image (X: 30mm, Y: +3mm, W: 40mm, H: 15mm)
            } catch (e) { // Catch any errors during image addition
                doc.line(examIcX - 15, signatureY + 10, examIcX + 25, signatureY + 10); // Draw placeholder line if image fails
            }
        }
        doc.setFontSize(10); // Set font size to 10pt for name
        doc.setFont("helvetica", "normal"); // Set font to Helvetica normal
        doc.text("(Jahangir Hussain)", examIcX, signatureY + 22); // Add name 22mm below title

        const principalX = 145; // Define Principal X-position at 145mm
        doc.text("Principal", principalX, signatureY); // Add "Principal" title at X: 145mm
        if (principalSignature) { // Check if principal signature image exists
            try { // Start a try-catch block for image addition
                doc.addImage(principalSignature, "PNG", principalX - 10, signatureY + 3, 40, 15); // Add signature image (X: 135mm, Y: +3mm, W: 40mm, H: 15mm)
            } catch (e) { // Catch any errors
                doc.line(principalX - 15, signatureY + 10, principalX + 25, signatureY + 10); // Draw placeholder line if image fails
            }
        }
        doc.setFontSize(10); // Set font size to 10pt for name
        doc.setFont("helvetica", "normal"); // Set font to Helvetica normal
        doc.text("(Abul Mojid Ali)", principalX, signatureY + 22); // Add name 22mm below title

        doc.setDrawColor(150, 150, 150); // Set line color to medium gray (RGB: 150, 150, 150)
        doc.setLineDashPattern([1, 1], 0); // Set dashed line pattern (1mm dash, 1mm gap)
        doc.line(examIcX - 15, signatureY + 15, examIcX + 25, signatureY + 15); // Draw dashed line below Exam In-Charge
        doc.line(principalX - 15, signatureY + 15, principalX + 25, signatureY + 15); // Draw dashed line below Principal

        // --- Date Below Signatures ---
        const dateY = signatureY + 30; // Position date 30mm below signatureY (after signatures and dashed lines)
        doc.setFontSize(10); // Set font size to 10pt for the date
        doc.setFont("helvetica", "normal"); // Set font to Helvetica normal
        doc.setTextColor(70, 70, 70); // Set text color to dark gray (RGB: 70, 70, 70)
        doc.text(`Report card generated on: ${new Date().toLocaleDateString()}`, 105, dateY, { align: "center" }); // Add centered date at X: 105mm

        // --- Footer ---
        const footerY = 297 - footerHeight; // Calculate footer Y-position (282mm for 15mm height)
        doc.setFillColor(70, 130, 180); // Set fill color to steel blue (RGB: 70, 130, 180)
        doc.rect(0, footerY, 210, footerHeight, "F"); // Draw filled rectangle for footer (X: 0, Y: 282mm, W: 210mm, H: 15mm)
        doc.setFont("helvetica", "normal"); // Set font to Helvetica normal
        doc.setFontSize(8); // Set font size to 8pt for footer text
        doc.setTextColor(255, 255, 255); // Set text color to white (RGB: 255, 255, 255)
        doc.text("Nashib Ali Academy - Nurturing Excellence Since 1995", 105, footerY + 7, { align: "center" }); // Add footer text at X: 105mm, Y: 289mm
        doc.text( // Add contact info on second line
            "www.nashibaliacademy.edu | contact@nashibaliacademy.edu | +1 234 567 8900",
            105,
            footerY + 12,
            { align: "center" } // Center-align at X: 105mm, Y: 294mm
        );

        const capitalizedName = resultData.name ? capitalizeName(resultData.name) : "Student"; // Set filename using capitalized name or "Student" if missing
        doc.save(`${capitalizedName}_Result_Card_${new Date().getFullYear()}.pdf`); // Save the PDF with the generated filename
    } catch (error) { // Catch any errors during PDF generation
        console.error("Error in PDF generation:", error); // Log the error to the console
        alert("An error occurred while generating the PDF."); // Show an alert to the user
    }
};