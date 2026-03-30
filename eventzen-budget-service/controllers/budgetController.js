const db = require("../config/db");

exports.setBudget = (req, res) => {
  const { event_id, total_budget } = req.body;

  const query = `
    INSERT INTO event_budget (event_id, total_budget)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE total_budget = ?
  `;

  db.query(query, [event_id, total_budget, total_budget], (err) => {
    if (err) {
      console.log("Set budget error:", err);
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: "Budget set successfully" });
  });
};


exports.addExpense = (req, res) => {
  const { event_id, title, amount } = req.body;

  const query = `
    INSERT INTO expense (event_id, title, amount)
    VALUES (?, ?, ?)
  `;

  db.query(query, [event_id, title, amount], (err) => {
    if (err) {
      console.log("Add expense error:", err);
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: "Expense added successfully" });
  });
};


exports.getSummary = (req, res) => {
  const eventId = req.params.eventId;

  const budgetQuery = `
    SELECT total_budget FROM event_budget WHERE event_id = ?
  `;

  const expenseQuery = `
    SELECT SUM(amount) AS total_expense FROM expense WHERE event_id = ?
  `;

  db.query(budgetQuery, [eventId], (err, budgetResult) => {
    if (err) {
      console.log("Summary budget error:", err);
      return res.status(500).json({ message: err.message });
    }

    db.query(expenseQuery, [eventId], (err, expenseResult) => {
      if (err) {
        console.log("Summary expense error:", err);
        return res.status(500).json({ message: err.message });
      }

      const budget = budgetResult[0]?.total_budget || 0;
      const expense = expenseResult[0]?.total_expense || 0;
      const remaining = budget - expense;

      res.json({
        total_budget: budget,
        total_expense: expense,
        remaining: remaining
      });
    });
  });
};


exports.getExpenses = (req, res) => {
  const eventId = req.params.eventId;

  const query = `
    SELECT * FROM expense
    WHERE event_id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [eventId], (err, result) => {
    if (err) {
      console.log("Fetch expenses error:", err);
      return res.status(500).json({ message: err.message });
    }

    res.json(result);
  });
};