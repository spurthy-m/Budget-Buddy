import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";

const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

const incomeCategories = [
  "Salary",
  "Business",
  "Freelance",
  "Other Income",
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("budgetBuddyTransactions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: getToday(),
  });

  useEffect(() => {
    localStorage.setItem(
      "budgetBuddyTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  /* =========================
     CALCULATIONS
  ========================= */

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const balance = income - expenses;

  /* =========================
     CHART
  ========================= */

  const chartData = expenseCategories.map((category) => {
    const amount = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category === category
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    return {
      category,
      amount,
    };
  });

  /* =========================
     FORM
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;

    setFormData((previous) => ({
      ...previous,
      type,
      category:
        type === "income"
          ? "Salary"
          : "Food",
    }));
  };

  const openForm = () => {
    setFormData({
      name: "",
      amount: "",
      type: "expense",
      category: "Food",
      date: getToday(),
    });

    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const amount = Number(formData.amount);

    if (!name) {
      alert("Please enter a transaction name.");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name,
      amount,
      type: formData.type,
      category: formData.category,
      date: formData.date,
    };

    setTransactions((previous) => [
      newTransaction,
      ...previous,
    ]);

    setFormData({
      name: "",
      amount: "",
      type: "expense",
      category: "Food",
      date: getToday(),
    });

    setShowForm(false);
  };

  /* =========================
     DELETE
  ========================= */

  const deleteTransaction = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    setTransactions((previous) =>
      previous.filter(
        (transaction) =>
          transaction.id !== id
      )
    );
  };

  /* =========================
     SEARCH
  ========================= */

  const filteredTransactions =
    transactions.filter((transaction) => {
      const text =
        `${transaction.name} ${transaction.category} ${transaction.type}`
          .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    });

  /* =========================
     DATE
  ========================= */

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="logo">
          <span>💰</span>
          <h2>Budget-Buddy</h2>
        </div>

        <nav>
          <button className="nav-item active">
            🏠 Dashboard
          </button>

          <button className="nav-item">
            💳 Transactions
          </button>

          <button className="nav-item">
            🎯 Budgets
          </button>

          <button className="nav-item">
            📊 Reports
          </button>

          <button className="nav-item">
            ⚙️ Settings
          </button>
        </nav>
      </aside>

      {/* MAIN */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">
          <div>
            <p className="welcome">
              Welcome back 👋
            </p>

            <h1>Dashboard</h1>
          </div>

          <button
            className="add-button"
            onClick={openForm}
          >
            + Add Transaction
          </button>
        </header>

        {/* =========================
            SUMMARY CARDS
        ========================= */}

        <section className="cards">

          {/* BALANCE */}

          <div className="card balance-card">
            <div className="card-icon">
              💰
            </div>

            <p>Total Balance</p>

            <h2>
              ₹{balance.toLocaleString("en-IN")}
            </h2>

            <span>
              Income − Expenses
            </span>
          </div>

          {/* INCOME */}

          <div className="card income-card">
            <div className="card-icon">
              📈
            </div>

            <p>Total Income</p>

            <h2>
              ₹{income.toLocaleString("en-IN")}
            </h2>

            <button
              className="card-add-button"
              onClick={() => {
                setFormData({
                  name: "",
                  amount: "",
                  type: "income",
                  category: "Salary",
                  date: getToday(),
                });

                setShowForm(true);
              }}
            >
              + Add Income
            </button>
          </div>

          {/* EXPENSE */}

          <div className="card expense-card">
            <div className="card-icon">
              📉
            </div>

            <p>Total Expenses</p>

            <h2>
              ₹{expenses.toLocaleString("en-IN")}
            </h2>

            <button
              className="card-add-button expense-add"
              onClick={() => {
                setFormData({
                  name: "",
                  amount: "",
                  type: "expense",
                  category: "Food",
                  date: getToday(),
                });

                setShowForm(true);
              }}
            >
              + Add Expense
            </button>
          </div>

        </section>

        {/* =========================
            CONTENT
        ========================= */}

        <section className="content-grid">

          {/* CHART */}

          <div className="panel">

            <div className="panel-header">
              <div>
                <h2>
                  Spending Overview
                </h2>

                <p>
                  Your expenses by category
                </p>
              </div>
            </div>

            <div className="real-chart">
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart data={chartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(
                        value
                      ).toLocaleString(
                        "en-IN"
                      )}`,
                      "Spent",
                    ]}
                  />

                  <Bar
                    dataKey="amount"
                    fill="#2563eb"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* TRANSACTIONS */}

          <div className="panel">

            <div className="panel-header">
              <div>
                <h2>
                  Recent Transactions
                </h2>

                <p>
                  {transactions.length}{" "}
                  transactions
                </p>
              </div>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="transactions">

              {filteredTransactions.length ===
              0 ? (
                <p className="empty-message">
                  No transactions yet.
                  <br />
                  Add your income or expenses
                  above.
                </p>
              ) : (
                filteredTransactions
                  .slice(0, 8)
                  .map((transaction) => (

                    <div
                      className="transaction"
                      key={transaction.id}
                    >

                      <div className="transaction-icon">
                        {transaction.type ===
                        "income"
                          ? "💼"
                          : "🛒"}
                      </div>

                      <div className="transaction-info">

                        <strong>
                          {transaction.name}
                        </strong>

                        <span>
                          {transaction.category}
                          {" • "}
                          {formatDate(
                            transaction.date
                          )}
                        </span>

                      </div>

                      <strong
                        className={
                          transaction.type ===
                          "income"
                            ? "amount income"
                            : "amount expense"
                        }
                      >
                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}

                        ₹
                        {Number(
                          transaction.amount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteTransaction(
                            transaction.id
                          )
                        }
                      >
                        🗑️
                      </button>

                    </div>

                  ))
              )}

            </div>

          </div>

        </section>

        {/* =========================
            ADD TRANSACTION MODAL
        ========================= */}

        {showForm && (

          <div
            className="modal-overlay"
            onClick={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowForm(false);
              }
            }}
          >

            <div className="modal transaction-modal">

              <button
                className="close-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

              <h2>
                Add Transaction
              </h2>

              <p>
                Enter your income or expense.
              </p>

              <form
                onSubmit={handleSubmit}
              >

                <label>
                  Transaction Name

                  <input
                    type="text"
                    name="name"
                    placeholder="Example: Salary, Rent, Food"
                    value={formData.name}
                    onChange={handleChange}
                    autoFocus
                  />
                </label>

                <label>
                  Amount

                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Type

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleTypeChange}
                  >
                    <option value="expense">
                      Expense
                    </option>

                    <option value="income">
                      Income
                    </option>
                  </select>
                </label>

                <label>
                  Category

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >

                    {formData.type ===
                    "income"
                      ? incomeCategories.map(
                          (category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {category}
                            </option>
                          )
                        )
                      : expenseCategories.map(
                          (category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {category}
                            </option>
                          )
                        )}

                  </select>
                </label>

                <label>
                  Date

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </label>

                <button
                  className="save-button"
                  type="submit"
                >
                  Save Transaction
                </button>

              </form>

            </div>

          </div>

        )}

      </main>
    </div>
  );
}

export default App;