import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", monthly_budget: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerUser(form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: "100%", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "11px 14px", fontSize: "14px", marginBottom: "1rem", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
  const lbl = { fontSize: "13px", fontWeight: 500, color: "#374151", display: "block", marginBottom: "6px" };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7fb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", padding: "2.5rem", width: "100%", maxWidth: "420px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: "10px", background: "#6d28d9", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: 600 }}>
            S
          </div>
          <span style={{ fontSize: "18px", fontWeight: 600, color: "#1a1a1a" }}>Smartfinance</span>
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>Create your account</h1>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 1.75rem" }}>Start tracking and growing your savings</p>

        {error && (
          <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "10px", marginBottom: "1rem", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={lbl}>Full name</label>
          <input type="text" placeholder="Jane Doe" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inp} />

          <label style={lbl}>Email</label>
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required style={inp} />

          <label style={lbl}>Password</label>
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required style={inp} />

          <label style={lbl}>Monthly budget (₹)</label>
          <input type="number" placeholder="e.g. 25000" value={form.monthly_budget}
            onChange={(e) => setForm({ ...form, monthly_budget: e.target.value })} required style={{ ...inp, marginBottom: "1.5rem" }} />

          <button type="submit" disabled={loading}
            style={{ width: "100%", background: "#6d28d9", color: "#fff", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "1.5rem" }}>
          Already have an account? <Link to="/login" style={{ color: "#6d28d9", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;