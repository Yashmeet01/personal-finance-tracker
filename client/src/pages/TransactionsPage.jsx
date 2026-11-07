import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/transactions";

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

  const token = localStorage.getItem("token");

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
  }

  // Runs once when the page appears: load my transactions
  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await fetch(API_URL, { headers: authHeaders() });
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