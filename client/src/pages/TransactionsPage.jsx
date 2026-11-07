import { useState } from "react";

function TransactionsPage() {
  // TEMPORARY sample data (not from MongoDB)
  const [transactions, setTransactions] = useState([
    { id: 1, title: "Lunch", amount: 150, type: "expense", category: "Food", date: "2026-11-05" },
    { id: 2, title: "Pocket money", amount: 2000, type: "income", category: "Allowance", date: "2026-11-01" },
    { id: 3, title: "Bus ticket", amount: 40, type: "expense", category: "Travel", date: "2026-11-03" },
  ]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");

  function handleSubmit(event) {
    event.preventDefault();

    if (title === "" || amount === "" || category === "" || date === "") {
      setError("Please fill all fields");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title: title,
      amount: Number(amount),
      type: type,
      category: category,
      date: date,
    };

    setTransactions([...transactions, newTransaction]);

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
    setError("");
  }

  function handleDelete(id) {
    const remaining = transactions.filter((item) => item.id !== id);
    setTransactions(remaining);
  }

  const visibleTransactions = transactions.filter((item) => {
    if (filterType === "all") {
      return true;
    }
    return item.type === filterType;
  });

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
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Add</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

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
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>₹{item.amount}</td>
              <td>{item.type}</td>
              <td>{item.category}</td>
              <td>{item.date}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsPage;
