import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;
const API_URL = API + "/api/transactions";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("token");

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
  }

  // Runs once when the page appears: load my transactions and categories
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(API_URL, { headers: authHeaders() });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError(data.message);
        } else {
          setTransactions(data);
        }

        const catResponse = await fetch(API + "/api/categories", {
          headers: authHeaders(),
        });
        const catData = await catResponse.json();
        if (catResponse.ok) {
          setCategories(catData);
        }
      } catch (err) {
        setError("Cannot reach the server");
      }
      setLoading(false);
    }

    loadData();
  }, []);

  function clearForm() {
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("");
    setDate("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (title === "" || amount === "" || category === "" || date === "") {
      setError("Please fill all fields");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    const body = JSON.stringify({ title, amount: Number(amount), type, category, date });

    try {
      let response;

      if (editingId === null) {
        response = await fetch(API_URL, {
          method: "POST",
          headers: authHeaders(),
          body: body,
        });
      } else {
        response = await fetch(API_URL + "/" + editingId, {
          method: "PUT",
          headers: authHeaders(),
          body: body,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      if (editingId === null) {
        setTransactions([data, ...transactions]);
        setSuccess("Transaction added");
      } else {
        setTransactions(
          transactions.map((item) => (item._id === editingId ? data : item))
        );
        setSuccess("Transaction updated");
      }

      clearForm();
    } catch (err) {
      setError("Cannot reach the server");
    }
  }

  function handleEdit(item) {
    setEditingId(item._id);
    setTitle(item.title);
    setAmount(item.amount);
    setType(item.type);
    setCategory(item.category);
    setDate(item.date.slice(0, 10));
    setError("");
    setSuccess("");
  }

  async function handleDelete(id) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch(API_URL + "/" + id, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setTransactions(transactions.filter((item) => item._id !== id));
      setSuccess("Transaction deleted");
    } catch (err) {
      setError("Cannot reach the server");
    }
  }

  const visibleTransactions = transactions.filter((item) => {
    const typeMatches = filterType === "all" || item.type === filterType;
    const categoryMatches =
      filterCategory === "" ||
      item.category.toLowerCase().includes(filterCategory.toLowerCase());
    return typeMatches && categoryMatches;
  });

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <div>
      <h2>Transactions</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          {categories.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">{editingId === null ? "Add" : "Update"}</button>
        {editingId !== null && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        {categories.length === 0 && (
          <p>No categories yet. Add some on the Budget page.</p>
        )}
      </form>

      <div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Filter by category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />
      </div>

      <p>Total transactions: {visibleTransactions.length}</p>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleTransactions.map((item) => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>₹{item.amount}</td>
              <td>{item.type}</td>
              <td>{item.category}</td>
              <td>{item.date.slice(0, 10)}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsPage;