const Budget = require("../models/Budget");

// GET /api/budgets/2026-11  -> budget for that month (amount 0 if none)
async function getBudget(req, res) {
  try {
    const budget = await Budget.findOne({
      user: req.user._id,
      month: req.params.month,
    });

    res.json({ month: req.params.month, amount: budget ? budget.amount : 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/budgets/2026-11  -> create or update that month's budget
async function setBudget(req, res) {
  try {
    const amount = Number(req.body.amount);
    const month = req.params.month;

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Month must look like 2026-11" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Budget must be greater than 0" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, month: month },
      { amount: amount },
      { new: true, upsert: true }
    );

    res.json({ month: budget.month, amount: budget.amount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getBudget, setBudget };