import { useState, useMemo } from "react";
import { useMess } from "../../context/MessContext";
import "./BillingRevenue.css";

const BillingRevenue = () => {
  const { students, bills, addBill, updateBill, deleteBill } = useMess();
  const [filter, setFilter] = useState("All");
  const [newBill, setNewBill] = useState({ studentName: "", month: "", amount: "", status: "Unpaid" });

  const handleAddBill = async (e) => {
    e.preventDefault();
    if (!newBill.studentName.trim() || !newBill.month.trim() || !newBill.amount) {
      alert("Please fill all fields");
      return;
    }
    await addBill({
      studentName: newBill.studentName.trim(),
      month: newBill.month.trim(),
      amount: Number(newBill.amount),
      status: newBill.status,
      date: new Date().toLocaleDateString(),
    });
    setNewBill({ studentName: "", month: "", amount: "", status: "Unpaid" });
  };

  const markPaid = async (id) => {
    await updateBill(id, { status: "Paid" });
  };

  const handleDelete = async (id) => {
    await deleteBill(id);
  };

  const filteredBills = useMemo(() => {
    if (filter === "All") return bills;
    return bills.filter((b) => b.status === filter);
  }, [bills, filter]);

  const paidBills = bills.filter((b) => b.status === "Paid").length;
  const unpaidBills = bills.filter((b) => b.status === "Unpaid").length;
  const totalRevenue = bills.filter((b) => b.status === "Paid").reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="billing-container">
      <h1>Billing Management</h1>
      <p className="subtitle">Manage and track student payments</p>

      <div className="summary-grid">
        <div className="card"><h4>Total Bills</h4><h2>{bills.length}</h2></div>
        <div className="card paid-card"><h4>Paid Bills</h4><h2>{paidBills}</h2></div>
        <div className="card unpaid-card"><h4>Unpaid Bills</h4><h2>{unpaidBills}</h2></div>
        <div className="card revenue-card"><h4>Total Revenue</h4><h2>₹{totalRevenue}</h2></div>
      </div>

      <form className="billing-form" onSubmit={handleAddBill}>
        <select value={newBill.studentName}
          onChange={(e) => setNewBill({ ...newBill, studentName: e.target.value })}>
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.email}>{s.name} — {s.email}</option>
          ))}
        </select>
        <input type="text" placeholder="Month (e.g. Feb 2026)" value={newBill.month}
          onChange={(e) => setNewBill({ ...newBill, month: e.target.value })} />
        <input type="number" placeholder="Amount" value={newBill.amount}
          onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })} />
        <select value={newBill.status} onChange={(e) => setNewBill({ ...newBill, status: e.target.value })}>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <button type="submit">Add Bill</button>
      </form>

      <div className="filter-tabs">
        {["All", "Paid", "Unpaid"].map((tab) => (
          <button key={tab} className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)}>{tab}</button>
        ))}
      </div>

      <div className="bill-list">
        {filteredBills.map((b) => (
          <div key={b.id} className={`bill-card ${b.status === "Paid" ? "paid" : "unpaid"}`}>
            <div className="bill-header">
              <h3>{b.studentName}</h3>
              <span className={b.status === "Paid" ? "badge paid-badge" : "badge unpaid-badge"}>{b.status}</span>
            </div>
            <p>Month: {b.month}</p>
            <p>Amount: ₹{b.amount}</p>
            <div className="bill-footer">
              <span>Date: {b.date}</span>
              <div className="actions">
                {b.status === "Unpaid" && (
                  <button className="pay-btn" onClick={() => markPaid(b.id)}>Mark Paid</button>
                )}
                <button className="delete-btn" onClick={() => handleDelete(b.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filteredBills.length === 0 && <p className="empty">No bills found</p>}
      </div>
    </div>
  );
};

export default BillingRevenue;
