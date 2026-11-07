import BudgetPage from "./pages/BudgetPage";
import { Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";

function App() {
  return (
    <div>
      <h1>Personal Finance Tracker</h1>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        {" | "}
        <Link to="/transactions">Transactions</Link>
        {" | "}
        <Link to="/budget">Budget</Link>
      </nav>

      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
      </Routes>
    </div>
  );
}

export default App;