const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.get("/hello", (req, res) => {
    res.send("Hello, Yashmeet!");
});
app.get("/api/sample", (req, res) => {
    const sampleTransactions = [
        { title: "Lunch", amount: 150, type: "expense" },
        { title: "Pocket money", amount: 2000, type: "income" },
    ];

    res.json(sampleTransactions);
});
app.listen(5000, () => {
    console.log("Server started on port 5000");
});