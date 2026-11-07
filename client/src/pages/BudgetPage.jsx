import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;
const BASE_URL = API + "/api";

function BudgetPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
  }

  // Load transactions and categories once
  useEffect(() => {
    async function loadData() {
      try {
        const transRes = await fetch(BASE_URL + "/transactions", {
          headers: authHeaders(),
        });

        if (transRes.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        const transData = await transRes.json();
        if (transRes.ok) {
          setTransactions(transData);
        }

        const catRes = await fetch(BASE_URL + "/categories", {
          headers: authHeaders(),
        });
        const catData = await catRes.json();
        if (catRes.ok) {
          setCategories(catData);
        }
      } catch (err) {
        setError("Cannot reach the server");
      }
      setLoading(false);
    }

    loadData();
  }, []);

  // Load the budget again whenever the month changes
  useEffect(() => {
    async function loadBudget() {
      try {
        const response = await fetch(BASE_URL + "/budgets/" + month, {
          headers: authHeaders(),
        });
        const data = await response.json();
        if (response.ok) {
          setBudget(data.amount);
        }
      } catch (err) {
        setError("Cannot reach the server");
      }
    }

    if (month) {
      loadBudget();
    }
  }, [month]);

  async function handleSetBudget(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (budgetInput === "" || Number(budgetInput) <= 0) {
      setError("Enter a budget greater than 0");
      return;
    }

    try {
      const response = await fetch(BASE_URL + "/budgets/" + month, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ amount: Number(budgetInput) }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setBudget(data.amount);
      setBudgetInput("");
      setSuccess("Budget saved for " + month);
    } catch (err) {
      setError("Cannot reach the server");
    }
  }

  async function handleAddCategory(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (categoryInput.trim() === "") {
      setError("Enter a category name");
      return;
    }

    try {
      const response = await fetch(BASE_URL + "/categories", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: categoryInput }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setCategories([...categories, data]);
      setCategoryInput("");
      setSuccess("Category added");
    } catch (err) {
      setError("Cannot reach the server");
    }
  }

  async function handleDeleteCategory(id) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(BASE_URL + "/categories/" + id, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setCategories(categories.filter((item) => item._id !== id));
      setSuccess("Category deleted");
    } catch (err) {
      setError("Cannot reach the server");
    }
  }

  if (loading) {
    return <p>Loading budget...</p>;
  }

  // Only expenses from the selected month
  const monthExpenses = transactions.filter(
    (item) => item.type === "expense" && item.date.startsWith(month)
  );

  const spent = monthExpenses.reduce((total, item) => total + item.amount, 0);
  const remaining = budget - spent;

  let percent = 0;
  if (budget > 0) {
    percent = (spent / budget) * 100;
  }

  let barClass = "bar-good";
  let warning = "";
  if (budget > 0 && percent > 100) {
    barClass = "bar-danger";
    warning = "Budget exceeded!";
  } else if (budget > 0 && percent >= 80) {
    barClass = "bar-warning";
    warning = "Warning: you are close to your budget.";
  }

  return (
    <div>
      <h2>Budget</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

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

      <div className="panel">
        <h3>Expense Categories</h3>

        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="New category (e.g. Food)"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
          />
          <button type="submit">Add Category</button>
        </form>

        {categories.length === 0 ? (
          <p>No categories yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>
                    <button onClick={() => handleDeleteCategory(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BudgetPage;