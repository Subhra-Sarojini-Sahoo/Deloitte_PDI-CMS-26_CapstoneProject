const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const budgetRoutes = require("./routes/budgetRoutes");
app.use("/api/budget", budgetRoutes);

app.get("/", (req, res) => {
  res.send("Budget service running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Budget service running on port ${PORT}`);
});