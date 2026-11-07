function DashboardPage() {
  // TEMPORARY sample data (not from MongoDB)
  const transactions = [
    { id: 1, title: "Lunch", amount: 150, type: "expense", category: "Food", date: "2026-11-05" },
    { id: 2, title: "Pocket money", amount: 2000, type: "income", category: "Allowance", date: "2026-11-01" },
    { id: 3, title: "Bus ticket", amount: 40, type: "expense", category: "Travel", date: "2026-11-03" },
  ];

  const incomeItems = transactions.filter((item) => item.type === "income");
  const expenseItems = transactions.filter((item) => item.type === "expense");

  const totalIncome = incomeItems.reduce((total, item) => total + item.amount, 0);
  const totalExpense = expenseItems.reduce((total, item) => total + item.amount, 0);
  const balance = totalIncome - totalExpense;

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
    </div>
  );
}

export default DashboardPage;