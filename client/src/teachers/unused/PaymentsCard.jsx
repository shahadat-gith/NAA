import React from "react";


const PaymentsCard = ({ payments = [] }) => {
  return (
    <section className="pc-card">
      {/* Header */}
      <div className="pc-header">
        <h2 className="pc-title">Processed Payments (Disbursed)</h2>
      </div>

      {/* Table */}
      <div className="pc-table-container">
        {payments.length > 0 ? (
          <table className="pc-table">
            <thead>
              <tr>
                <th>Salary Month</th>
                <th>Disbursement Date</th>
                <th>Amount Paid</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="pc-month-cell">
                    <strong>{payment.salaryMonth}</strong>
                  </td>

                  <td className="pc-date-cell">
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </td>
                  <td className="pc-payment-amount">
                    ₹{payment.amount?.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`pc-status-badge ${payment.status?.toLowerCase()}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="pc-no-data">
            No processed payment transaction receipts found.
          </p>
        )}
      </div>
    </section>
  );
};

export default PaymentsCard;
