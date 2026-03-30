const express = require("express");
const router = express.Router();
const controller = require("../controllers/budgetController");

router.post("/set", controller.setBudget);
router.post("/expense", controller.addExpense);
router.get("/summary/:eventId", controller.getSummary);
router.get("/expenses/:eventId", controller.getExpenses);

module.exports = router;