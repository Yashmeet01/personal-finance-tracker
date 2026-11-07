import { useState } from "react";

function BudgetPage() {
  // TEMPORARY sample data (not from MongoDB)
  const expenses = [
    { id: 1, title: "Lunch", amount: 150, category: "Food", date: "2026-11-05" },
    { id: 2, title: "Bus ticket", amount: 40, category: "Travel", date: "2026-11-03" },
    { id: 3, title: "Movie", amount: 300, category: "Fun", date: "2026-10-20" },
  ];

  const [month, setMonth] = useState("2026-11");
  const [budget, setBudget] = useState(500);
  const [budgetInput, setBudgetInput] = useState("");
  const [error, setError] = useState("");

  // Only expenses from the selected month
  const monthExpenses = expenses.filter((item) => item.date.startsWith(month));

  const spent = monthExpenses.reduce((total, item) => total + item.amount, 0);
  const remaining = budget - spent;

  let percent = 0;
  if (budget > 0) {
    percent = (spent / budget) * 100;
  }

  let barClass = "bar-good";
  let warning = "";
  if (percent > 100) {
    barClass = "bar-danger";
    warning = "Budget exceeded!";
  } else if (percent >= 80) {
    barClass = "bar-warning";
    warning = "Warning: you are close to your budget.";
  }

  function handleSetBudget(event) {
    event.preventDefault();

    if (budgetInput === "" || Number(budgetInput) <= 0) {
      setError("Enter a budget greater than 0");
      return;
    }

    setBudget(Number(budgetInput));
    setBudgetInput("");
    setError("");
  }

  return (
    <div>
      <h2>Budget</h2>

      <form onSubmit={handleSetBudget}>
        <label>Month: </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <input
          type="number"
          placeholder="Set monthly budget"
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
        />
        <button type="submit">Set Budget</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <div className="cards">
        <div className="card">
          <p>Budget</p>
          <h3>₹{budget}</h3>
        </div>
        <div className="card expense-card">
          <p>Spent</p>
          <h3>₹{spent}</h3>
        </div>
        <div className="card income-card">
          <p>Remaining</p>
          <h3>₹{remaining}</h3>
        </div>
      </div>

      <div className="progress-box">
        <div className="progress-track">
          <div
            className={"progress-bar " + barClass}
            style={{ width: Math.min(percent, 100) + "%" }}
          ></div>
        </div>
        <p>{Math.round(percent)}% of budget used</p>
        {warning && <p className="warning-text">{warning}</p>}
      </div>
    </div>
  );
}

export default BudgetPage;