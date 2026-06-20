import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const PURPLE = "#6d28d9";
const PURPLE_LIGHT = "#ede9fe";
const RED = "#dc2626";
const GREEN = "#16a34a";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: "expense", category: "", amount: "", description: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      const data = res.data.transactions || [];
      setTransactions(data);
      const totalIncome = data.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
      const totalExpense = data.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
      setStats({ totalIncome, totalExpense, balance: totalIncome - totalExpense });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/transactions", form);
      setMsg("Transaction added successfully");
      setForm({ type: "expense", category: "", amount: "", description: "", date: "" });
      fetchTransactions();
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.message || "Failed to add transaction"));
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const inp = { width: "100%", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px 12px", fontSize: "13px", boxSizing: "border-box", outline: "none", marginBottom: "10px", fontFamily: "inherit" };
  const lbl = { fontSize: "12px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "4px" };

  const categoryMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });
  const pieLabels = Object.keys(categoryMap);
  const pieValues = Object.values(categoryMap);

  const pieData = {
    labels: pieLabels.length ? pieLabels : ["No data"],
    datasets: [{
      data: pieValues.length ? pieValues : [1],
      backgroundColor: ["#6d28d9", "#a78bfa", "#c4b5fd", "#8b5cf6", "#7c3aed", "#5b21b6", "#4c1d95"],
      borderColor: "#fff",
      borderWidth: 2,
    }],
  };

  const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const lineLabels = sortedTx.map(t => t.date);
  const lineValues = sortedTx.map(t => t.type === "expense" ? Number(t.amount) : 0);

  const lineData = {
    labels: lineLabels.length ? lineLabels : ["No data"],
    datasets: [{
      label: "Expenses",
      data: lineValues.length ? lineValues : [0],
      borderColor: PURPLE,
      backgroundColor: "rgba(109,40,217,0.08)",
      tension: 0.35,
      pointBackgroundColor: PURPLE,
      fill: true,
    }],
  };

  const chartOptions = {
    plugins: { legend: { labels: { color: "#374151", font: { family: "Inter", size: 11 } } } },
  };

  const lineOptions = {
    plugins: { legend: { labels: { color: "#374151", font: { family: "Inter", size: 11 } } } },
    scales: {
      x: { ticks: { color: "#9ca3af", font: { size: 9 } }, grid: { color: "#f3f4f6" } },
      y: { ticks: { color: "#9ca3af", font: { size: 9 } }, grid: { color: "#f3f4f6" } },
    },
  };

  const card = { background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" };
  const cardTitle = { fontSize: "15px", fontWeight: 600, color: "#1a1a1a", margin: "0 0 1rem" };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7fb", fontFamily: "'Inter', -apple-system, sans-serif", padding: "24px" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 38, height: 38, borderRadius: "10px", background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: 600 }}>
            S
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "16px", color: "#1a1a1a" }}>Smartfinance</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Welcome back, {user?.name}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/insights")} style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#374151", borderRadius: "10px", padding: "9px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            Insights
          </button>
          <button onClick={() => navigate("/profile")} style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#374151", borderRadius: "10px", padding: "9px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            Profile
          </button>
          <button onClick={handleLogout} style={{ background: "#fff", border: "1px solid #fecaca", color: RED, borderRadius: "10px", padding: "9px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
        <div style={{ background: "#f3f0ff", borderRadius: "14px", padding: "1.25rem" }}>
          <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#6d28d9" }}>Total income</p>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: 600, color: "#4c1d95" }}>₹{stats.totalIncome.toLocaleString()}</p>
        </div>
        <div style={{ background: "#fef2f2", borderRadius: "14px", padding: "1.25rem" }}>
          <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#dc2626" }}>Total expense</p>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: 600, color: "#991b1b" }}>₹{stats.totalExpense.toLocaleString()}</p>
        </div>
        <div style={{ background: stats.balance >= 0 ? "#f0fdf4" : "#fef2f2", borderRadius: "14px", padding: "1.25rem" }}>
          <p style={{ margin: "0 0 6px", fontSize: "13px", color: stats.balance >= 0 ? "#16a34a" : "#dc2626" }}>Net balance</p>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: 600, color: stats.balance >= 0 ? "#15803d" : "#991b1b" }}>₹{stats.balance.toLocaleString()}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div style={card}>
          <p style={cardTitle}>Expense breakdown</p>
          <div style={{ maxWidth: "260px", margin: "0 auto" }}>
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
        <div style={card}>
          <p style={cardTitle}>Spending trend</p>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        <div style={card}>
          <p style={cardTitle}>Add transaction</p>
          {msg && (
            <p style={{ fontSize: "12px", color: msg.includes("Error") ? RED : GREEN, marginBottom: "10px" }}>{msg}</p>
          )}
          <form onSubmit={handleAdd}>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category: "" })} style={inp}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required style={inp}>
                  <option value="">Select</option>
                  {form.type === "expense" ? (
                    <>
                      <option value="Food">Food</option>
                      <option value="Rent">Rent</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Transport">Transport</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Bills">Bills & utilities</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Travel">Travel</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Business">Business</option>
                      <option value="Investment">Investment returns</option>
                      <option value="Gift">Gift</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <label style={lbl}>Amount (₹)</label>
            <input type="number" placeholder="0.00" value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })} required style={inp} />
            <label style={lbl}>Description</label>
            <input type="text" placeholder="Optional note" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} style={inp} />
            <label style={lbl}>Date</label>
            <input type="date" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })} required style={{ ...inp, marginBottom: "14px" }} />
            <button type="submit" disabled={loading}
              style={{ width: "100%", background: PURPLE, color: "#fff", border: "none", borderRadius: "10px", padding: "11px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              {loading ? "Adding..." : "Add transaction"}
            </button>
          </form>
        </div>

        <div style={card}>
          <p style={cardTitle}>Recent activity</p>
          <div style={{ maxHeight: "420px", overflowY: "auto" }}>
            {transactions.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "13px" }}>No transactions yet</p>
            ) : (
              transactions.slice(0, 20).map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "8px", background: t.type === "income" ? "#f0fdf4" : PURPLE_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>
                      {t.type === "income" ? "↑" : "↓"}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "#1a1a1a" }}>{t.category}</p>
                      <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>{t.date}{t.description ? ` · ${t.description}` : ""}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: t.type === "income" ? GREEN : RED }}>
                    {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;