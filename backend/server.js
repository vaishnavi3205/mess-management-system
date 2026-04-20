const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);







app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await require("./db").promise().query("SELECT 1");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.send("DB Error");
  }
});