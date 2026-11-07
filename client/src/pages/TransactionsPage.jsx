import { useState } from "react";

function TransactionsPage() {
  // TEMPORARY sample data (not from MongoDB)
  const [transactions, setTransactions] = useState([
    { id: 1, title: "Lunch", amount: 150, type: "expense", category: "Food", date: "2026-11-05" },
    { id: 2, title: "Pocket money", amount: 2000, type: "income", category: "Allowance", date: "2026-11-01" },
    { id: 3, title: "Bus ticket", amount: 40, type: "expense", category: "Travel", date: "2026-11-03" },
  ]);

  return (
    <div>
      <h2>Transactions</h2>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>₹{item.amount}</td>
              <td>{item.type}</td>
              <td>{item.category}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsPage;