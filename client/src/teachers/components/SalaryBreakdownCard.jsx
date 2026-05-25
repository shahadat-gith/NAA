import React from "react";
import "../styles/SalaryBreakdownCard.css";

const SalaryBreakdownCard = ({dues = { dueMonths: [] }}) => {

  const dueMonths = dues?.dueMonths || [];

  return (
    <div className="sbc-wrapper">

      <div className="sbc-header">
          <h2 className="sbc-title">
            Pending Salary Breakdown
          </h2>
        </div>

        <div className="sbc-table-container">
          {dueMonths.length > 0 ? (
            <table className="sbc-table">

              <thead>
                <tr>
                  <th>Salary Month</th>
                  <th>Accrued Amount</th>
                  <th>Last Updated By Admin</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {dueMonths.map((item, index) => (
                  <tr key={index}>

                    <td className="sbc-month-cell">
                      <strong>{item.month}</strong>
                    </td>

                    <td className="sbc-due-amount">
                      ₹{item.amount?.toLocaleString("en-IN")}
                    </td>

                    <td className="sbc-date-cell">
                      {item.updatedOn
                        ? new Date(item.updatedOn).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>

                    <td>
                      <span className="sbc-status-badge pending">
                        Not Paid
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          ) : (
            <p className="sbc-no-data">
              All generated salaries are fully settled up to date! 🎉
            </p>
          )}
        </div>

    </div>
  );
};

export default SalaryBreakdownCard;