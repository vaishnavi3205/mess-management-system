import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useMess } from "../../../context/MessContext";
import { FaDownload } from "react-icons/fa";
import "./BillsReceipt.css";

const BillsReceipt = () => {
  const { user } = useAuth();
  const { bills } = useMess();

  const generateReceipt = (bill) => {
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Smart Mess Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Smart Mess Receipt</h1>
          </div>
          <div class="details">
            <p><strong>Student Name:</strong> ${user.email}</p>
            <p><strong>Month:</strong> ${bill.month}</p>
            <p><strong>Amount:</strong> ₹${bill.amount}</p>
            <p><strong>Status:</strong> ${bill.status}</p>
            <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  const studentBills = bills.filter(bill => 
    bill.studentName === user.email
  );

  const billsSummary = {
    total: studentBills.length,
    paid: studentBills.filter(b => b.status === "Paid").length,
    unpaid: studentBills.filter(b => b.status === "Unpaid").length,
    totalPaid: studentBills.filter(b => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0)
  };

  return (
    <div className="tab-content">
      <h2>Bills & Receipt</h2>
      <div className="bills-summary">
        <div className="summary-card">
          <h4>Total Bills</h4>
          <span className="summary-value">{billsSummary.total}</span>
        </div>
        <div className="summary-card paid">
          <h4>Paid</h4>
          <span className="summary-value">{billsSummary.paid}</span>
        </div>
        <div className="summary-card unpaid">
          <h4>Unpaid</h4>
          <span className="summary-value">{billsSummary.unpaid}</span>
        </div>
        <div className="summary-card total">
          <h4>Total Paid</h4>
          <span className="summary-value">₹{billsSummary.totalPaid}</span>
        </div>
      </div>

      {studentBills.length > 0 ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {studentBills.map(bill => (
                <tr key={bill.id}>
                  <td>{bill.month}</td>
                  <td>₹{bill.amount}</td>
                  <td>
                    <span className={`status-badge ${bill.status.toLowerCase()}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="download-btn"
                      onClick={() => generateReceipt(bill)}
                    >
                      <FaDownload /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-emoji">💳</span>
          <h3>No Bills Found</h3>
          <p>No bills found for your account. Contact the mess owner.</p>
        </div>
      )}
    </div>
  );
};

export default BillsReceipt;