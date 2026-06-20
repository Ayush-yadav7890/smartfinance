import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const PURPLE = "#6d28d9";

const Profile = () => {
  const { login, token } = useAuth();
  const [form, setForm] = useState({ monthly_salary: "", savings_goal: "", emergency_fund: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        const u = res.data.user;
        setForm({
          monthly_salary: u.monthly_salary || "",
          savings_goal: u.savings_goal || "",
          emergency_fund: u.emergency_fund || "",
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await API.put("/auth/profile", form);
      login(res.data.user, token);
      setMsg("Profile updated successfully");
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.message || "Failed to update"));
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const inp = { width: "100%", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "11px 14px", fontSize: "14px", marginBottom: "1.1rem", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
  const lbl = { fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" };

  const disposable = (Number(form.monthly_salary) || 0) - (Number(form.savings_goal) || 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7fb", fontFamily: "'Inter', -apple-system, sans-serif", padding: "24px" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 38, height: 38, borderRadius: "10px", background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: 600 }}>
            S
          </div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "16px", color: "#1a1a1a" }}>Smartfinance</p>
        </div>
        <Link to="/dashboard" style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#374151", borderRadius: "10px", padding: "9px 16px", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>
          Back to dashboard
        </Link>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px" }}>Financial profile</h2>
        <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 1.5rem" }}>Set your salary and savings targets to unlock personalized insights</p>

        {msg && (
          <div style={{ background: msg.includes("Error") ? "#fef2f2" : "#f0fdf4", color: msg.includes("Error") ? "#dc2626" : "#16a34a", padding: "10px 14px", borderRadius: "10px", marginBottom: "1rem", fontSize: "13px" }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={lbl}>Monthly salary (₹)</label>
          <input type="number" placeholder="e.g. 50000" value={form.monthly_salary}
            onChange={(e) => setForm({ ...form, monthly_salary: e.target.value })} required style={inp} />

          <label style={lbl}>Monthly savings goal (₹)</label>
          <input type="number" placeholder="e.g. 10000" value={form.savings_goal}
            onChange={(e) => setForm({ ...form, savings_goal: e.target.value })} required style={inp} />

          <label style={lbl}>Emergency fund target (₹)</label>
          <input type="number" placeholder="e.g. 100000" value={form.emergency_fund}
            onChange={(e) => setForm({ ...form, emergency_fund: e.target.value })} required style={inp} />

          {form.monthly_salary && form.savings_goal && (
            <div style={{ background: "#f3f0ff", borderRadius: "10px", padding: "12px 14px", marginBottom: "1.25rem", fontSize: "13px", color: "#4c1d95" }}>
              Disposable income after savings: <strong>₹{disposable.toLocaleString()}</strong>
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: "100%", background: PURPLE, color: "#fff", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            {loading ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;