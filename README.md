# Personal Finance Tracker

A full-stack MERN application to track income, expenses and monthly budgets.
Built as my final project for DevCamp 2.0.

## Features

- Signup and login with JWT authentication and bcrypt password hashing
- Protected pages (private pages need login)
- Dashboard: balance, income, expenses, monthly spending, recent transactions, income vs expense bars
- Transactions: add, edit, delete, filter by type and category
- Budget: monthly budget, spent and remaining, warning when close to or over the limit
- Expense categories: add and delete
- Every user can see only their own data

## Tech Stack

- Frontend: React (Vite), React Router, plain CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose

## How to Run

1. Clone the repository.
2. Backend:
   ```
   cd server
   npm install
   ```
   Create a `.env` file (see `.env.example`) with `MONGO_URI` and `JWT_SECRET`, then:
   ```
   node server.js
   ```
3. Frontend (in a second terminal):
   ```
   cd client
   npm install
   npm run dev
   ```
4. Open http://localhost:5173

## API Overview

| Route | Purpose |
|---|---|
| `POST /api/auth/signup`, `POST /api/auth/login` | Create account, log in |
| `/api/transactions` (GET, POST, PUT, DELETE) | Manage transactions |
| `/api/categories` (GET, POST, DELETE) | Manage categories |
| `/api/budgets/:month` (GET, PUT) | Read and set monthly budget |

All routes except signup and login require a valid token.

## Author

Yashmeet