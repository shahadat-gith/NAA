export const getAdmissionEmailTemplate = (status, studentEmail, password, loginUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nashib Ali Academy - Admission Status</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <tr>
          <td style="background: linear-gradient(to right, #1e3a8a, #3b82f6); padding: 20px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 24px;">Nashib Ali Academy</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h3 style="color: #1e3a8a; margin-top: 0; font-size: 20px;">Admission Status Update</h3>
            ${
              status === "Approved"
                ? `
                  <div style="background-color: #e6ffe6; padding: 15px; border-left: 4px solid #10b981; border-radius: 4px; margin-bottom: 20px;">
                    <p style="margin: 0;"><strong>Congratulations!</strong> Your admission application has been approved.</p>
                  </div>
                  <p>Please log in to your profile using the following credentials:</p>
                  <div style="background-color: #dbeafe; padding: 15px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${studentEmail}</p>
                    <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                  </div>
                  <p>Please use the following link to log in:</p>
                  <p><a href="${loginUrl}" style="color: #3b82f6; text-decoration: none; font-weight: bold;">${loginUrl}</a></p>
                  <p>Once logged in, you can download your payment and admission receipts from your profile. We recommend changing your password after your first login.</p>
                `
                : `
                  <div style="background-color: #ffe6e6; padding: 15px; border-left: 4px solid #ef4444; border-radius: 4px; margin-bottom: 20px;">
                    <p style="margin: 0;"><strong>Application Status:</strong> We regret to inform you that your admission application has been rejected.</p>
                  </div>
                  <p>Your admission fee will be refunded within 3 working days. For more information, please contact our admission office at <a href="mailto:admissions@nashibaliacademy.com" style="color: #3b82f6; text-decoration: none;">admissions@nashibaliacademy.com</a>.</p>
                `
            }
            <p style="margin-top: 20px;">If you have any questions, please contact our support team at <a href="mailto:support@nashibaliacademy.com" style="color: #3b82f6; text-decoration: none;">support@nashibaliacademy.com</a> or call (123) 456-7890.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #1e3a8a; padding: 15px; text-align: center; color: #ffffff; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Nashib Ali Academy. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};