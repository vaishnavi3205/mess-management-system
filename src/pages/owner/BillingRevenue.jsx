import React, { useState, useMemo } from "react";
import "./BillingRevenue.css";

const BillingRevenue = () => {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  const [newBill, setNewBill] = useState({
    studentName: "",
    month: "",
    amount: "",
    status: "Unpaid",
  });

  // ===== ADD BILL FUNCTION =====
  const handleAddBill = (e) => {
    e.preventDefault();

    if (
      newBill.studentName.trim() === "" ||
      newBill.month.trim() === "" ||
      newBill.amount === ""
    ) {
      setError("⚠ Please fill all fields before adding bill.");
      return;
    }

    const bill = {
      id: Date.now(),
      studentName: newBill.studentName.trim(),
      month: newBill.month.trim(),
      amount: Number(newBill.amount),
      status: newBill.status,
    };

    setBills((prev) => [...prev, bill]);

    // reset form
    setNewBill({
      studentName: "",
      month: "",
      amount: "",
      status: "Unpaid",
    });

    setError(""); // clear error
  };

  // ===== FILTER LOGIC =====
  const filteredBills = useMemo(() => {
    if (filter === "All") return bills;
    return bills.filter((bill) => bill.status === filter);
  }, [bills, filter]);

  // ===== CALCULATIONS =====
  const totalStudents = bills.length;
  const paidBills = bills.filter((b) => b.status === "Paid").length;
  const unpaidBills = bills.filter((b) => b.status === "Unpaid").length;
  const totalRevenue = bills
    .filter((b) => b.status === "Paid")
    .reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="billing-container">
      <div className="billing-header">
        <div>
          <h1>Billing Management</h1>
          <p>Manage and track student payments</p>
        </div>
      </div>

      {/* ===== FORM ===== */}
      <form className="input-section" onSubmit={handleAddBill}>
        <input
          type="text"
          placeholder="Student Name"
          value={newBill.studentName}
          onChange={(e) =>
            setNewBill({ ...newBill, studentName: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Month (e.g. Feb 2026)"
          value={newBill.month}
          onChange={(e) =>
            setNewBill({ ...newBill, month: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={newBill.amount}
          onChange={(e) =>
            setNewBill({ ...newBill, amount: e.target.value })
          }
        />

        <select
          value={newBill.status}
          onChange={(e) =>
            setNewBill({ ...newBill, status: e.target.value })
          }
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <button type="submit" className="add-btn">
          + Add Bill
        </button>
      </form>

      {/* ===== ERROR MESSAGE ===== */}
      {error && <p className="error-text">{error}</p>}

      {/* ===== SUMMARY ===== */}
      <div className="billing-summary">
        <div className="summary-card">
          <h4>Total Students</h4>
          <h2>{totalStudents}</h2>
        </div>

        <div className="summary-card paid-card">
          <h4>Paid Bills</h4>
          <h2>{paidBills}</h2>
        </div>

        <div className="summary-card unpaid-card">
          <h4>Unpaid Bills</h4>
          <h2>{unpaidBills}</h2>
        </div>

        <div className="summary-card revenue-card">
          <h4>Total Revenue</h4>
          <h2>₹{totalRevenue}</h2>
        </div>
      </div>

      {/* ===== FILTER ===== */}
      <div className="filter-tabs">
        {["All", "Paid", "Unpaid"].map((type) => (
          <button
            key={type}
            type="button"
            className={`tab ${filter === type ? "active" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ===== TABLE ===== */}
      <div className="billing-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.studentName}</td>
                <td>{bill.month}</td>
                <td>₹{bill.amount}</td>
                <td>
                  <span
                    className={`status ${
                      bill.status === "Paid" ? "paid" : "unpaid"
                    }`}
                  >
                    {bill.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBills.length === 0 && (
          <p className="empty-text">No bills found</p>
        )}
      </div>
    </div>
  );
};

export default BillingRevenue;