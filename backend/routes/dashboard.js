const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const data = {};

    // total students
    const [students] = await db.promise().query("SELECT COUNT(*) AS total FROM students");
    data.students = students[0]?.total || 0;

    // active students
    const [active] = await db.promise().query("SELECT COUNT(*) AS total FROM students WHERE status='active'");
    data.activeStudents = active[0]?.total || 0;

    // total revenue (convert to number)
    const [rev] = await db.promise().query("SELECT SUM(amount) AS total FROM revenue");
    data.revenue = Number(rev[0]?.total) || 0;

    // revenue chart (convert values to number)
    const [revChart] = await db.promise().query("SELECT month, amount as value FROM revenue");
    data.revenueChart = revChart.map(r => ({
      month: r.month,
      value: Number(r.value)
    }));

    // plate consumption (format date → Mon, Tue)
    const [plates] = await db.promise().query("SELECT * FROM plate_consumption");
    data.plateChart = plates.map(p => ({
      day: new Date(p.date).toLocaleDateString("en-IN", { weekday: "short" }),
      breakfast: p.breakfast,
      lunch: p.lunch,
      dinner: p.dinner
    }));

    // waste chart (format + number)
    const [waste] = await db.promise().query("SELECT * FROM waste");
    data.wasteChart = waste.map(w => ({
      day: new Date(w.date).toLocaleDateString("en-IN", { weekday: "short" }),
      value: Number(w.waste_kg)
    }));

    // complaints
    const [complaints] = await db.promise().query("SELECT COUNT(*) AS total FROM complaints WHERE status='pending'");
    data.complaints = complaints[0]?.total || 0;

    // low stock
    const [stock] = await db.promise().query("SELECT COUNT(*) AS total FROM inventory WHERE quantity < 10");
    data.lowStock = stock[0]?.total || 0;

    res.json(data);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;