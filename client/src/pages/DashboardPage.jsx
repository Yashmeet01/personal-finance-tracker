import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/transactions";

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTransactions() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_URL, {
          headers: { Authorization: "Bearer " + token },
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.message);
        } else {
          setTransactions(data);
        }
      } catch (err) {
        setError("Cannot reach the server");
      }
      setLoading(false);
    }

    loadTransactions();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = totalIncome - totalExpense;

  const recent = transactions.slice(0, 5);

  // Monthly spending: { "2026-11": 190, "2026-10": 300 }
  const monthlySpending = {};
  transactions.forEach((item) => {
    if (item.type === "expense") {
      const month = item.date.slice(0, 7);
      monthlySpending[month] = (monthlySpending[month] || 0) + item.amount;
    }
  });
  const months = Object.keys(monthlySpending).sort().reverse();

  const biggest = Math.max(totalIncome, totalExpense, 1);

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="cards">
        <div className="card balance-card">
          <p>Total Balance</p>
          <h3>₹{balance}</h3>
        </div>
        <div className="card income-card">
          <p>Total Income</p>
          <h3>₹{totalIncome}</h3>
        </div>
        <div className="card expense-card">
          <p>Total Expenses</p>
          <h3>₹{totalExpense}</h3>
        </div>
      </div>

      <div className="panel">
        <h3>Income vs Expense</h3>
        <p>Income</p>
        <div className="progress-track">
          <div
            className="progress-bar bar-good"
            style={{ width: (totalIncome / biggest) * 100 + "%" }}
          ></div>
        </div>
        <p>Expense</p>
        <div className="progress-track">
          <div
            className="progress-bar bar-danger"
            style={{ width: (totalExpense / biggest) * 100 + "%" }}
          ></div>
        </div>
      </div>

      <div className="panel">
        <h3>Monthly Spending</h3>
        {months.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Spent</th>
              </tr>
            </thead>
            <tbody>
              {months.map((month) => (
                <tr key={month}>
                  <td>{month}</td>
                  <td>₹{monthlySpending[month]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <h3>Recent Transactions</h3>
        {recent.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>₹{item.amount}</td>
                  <td>{item.type}</td>
                  <td>{item.date.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;