import { useState, useEffect } from "react";
import axios from "axios";

function ManageBudget() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [budget, setBudget] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/services/vendor/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEvents(response.data);
    } catch (err) {
      console.log("Failed to load services", err);
      setError("Failed to load services");
    }
  };

  const loadSummary = async (id) => {
    if (!id) {
      setError("Please select a service");
      setMessage("");
      return;
    }

    try {
      const summaryRes = await axios.get(
        `http://localhost:5000/api/budget/summary/${id}`
      );

      const expenseRes = await axios.get(
        `http://localhost:5000/api/budget/expenses/${id}`
      );

      setSummary(summaryRes.data);
      setExpenses(expenseRes.data);
      setError("");
      setMessage("");
    } catch {
      setSummary(null);
      setExpenses([]);
      setError("Could not load data");
      setMessage("");
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();

    if (!eventId || !budget) {
      setError("Please select service and enter budget");
      setMessage("");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/budget/set", {
       eventId: parseInt(eventId),
      totalBudget: parseFloat(budget),
      });

      setMessage("Budget set successfully");
      setError("");
      setBudget("");
      loadSummary(eventId);
    } catch {
      setMessage("");
      setError("Failed to set budget");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!eventId || !expenseTitle || !expenseAmount) {
      setError("Please fill all expense fields");
      setMessage("");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/budget/expense", {
        eventId: parseInt(eventId),
        title: expenseTitle,
        amount: parseFloat(expenseAmount),
      });

      setMessage("Expense added successfully");
      setError("");
      setExpenseTitle("");
      setExpenseAmount("");
      loadSummary(eventId);
    } catch {
      setMessage("");
      setError("Failed to add expense");
    }
  };

  return (
    <div className="page-container manage-budget-page">
      <h2 className="page-title">Manage Budget</h2>

      <div className="budget-wrapper">
        <div className="budget-card">
          <div className="budget-section">
            <label className="budget-label">Select Service</label>

            <div className="budget-inline-row">
              <select
                className="input budget-input"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
              >
                <option value="">Select Service</option>
                {events.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.serviceName} ({service.category}) - ₹{service.price}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="button budget-inline-btn"
                onClick={() => loadSummary(eventId)}
              >
                Load Summary
              </button>
            </div>
          </div>

          <form className="budget-section" onSubmit={handleSetBudget}>
            <h3 className="budget-section-title">Set Budget</h3>
            <input
              type="number"
              className="input budget-input"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter total budget"
              required
            />
            <button type="submit" className="button budget-full-btn">
              Save Budget
            </button>
          </form>

          <form className="budget-section" onSubmit={handleAddExpense}>
            <h3 className="budget-section-title">Add Expense</h3>
            <input
              type="text"
              className="input budget-input"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              placeholder="Expense title"
              required
            />
            <input
              type="number"
              className="input budget-input"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="Expense amount"
              required
            />
            <button type="submit" className="button budget-full-btn">
              Add Expense
            </button>
          </form>

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}

          {summary && (
            <div className="budget-summary-box">
              <h3 className="budget-section-title">Budget Summary</h3>
              <p><strong>Total Budget:</strong> ₹{summary.total_budget}</p>
              <p><strong>Total Expense:</strong> ₹{summary.total_expense}</p>
              <p><strong>Remaining:</strong> ₹{summary.remaining}</p>
            </div>
          )}

          {expenses.length > 0 && (
            <div className="budget-summary-box">
              <h3 className="budget-section-title">Expenses</h3>
              {expenses.map((exp) => (
                <div key={exp.id} className="expense-row">
                  <span>{exp.title}</span>
                  <span>₹{exp.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageBudget;