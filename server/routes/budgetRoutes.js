const express = require("express");
const { getBudget, setBudget } = require("../controllers/budgetController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:month", protect, getBudget);
router.put("/:month", protect, setBudget);

module.exports = router;