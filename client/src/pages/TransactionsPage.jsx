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
        const data = await response.json();

        if (!response.ok) {
          setError(data.message);
        } else {
          setTransactions(data);
        }

        const catResponse = await fetch("http://localhost:5000/api/categories", {
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