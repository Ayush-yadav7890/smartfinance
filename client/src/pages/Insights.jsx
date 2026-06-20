import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const PURPLE = "#6d28d9";
const RED = "#dc2626";
const GREEN = "#16a34a";
const AMBER = "#d97706";

const Insights = () => {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, txRes] = await Promise.all([
          API.get("/auth/profile"),
          API.get("/transactions"),
        ]);
        setProfile(profileRes.data.user);
        setTransactions(txRes.data.transactions || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f7fb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: "#6b7280" }}>
        Analyzing your data...
      </div>
    );
  }

  const salary = Number(profile?.monthly_salary) || 0;
  const savingsGoal = Number(profile?.savings_goal) || 0;
  const emergencyTarget = Number(profile?.emergency_fund) || 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthTx = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const thisMonthIncome = thisMonthTx.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const thisMonthExpense = thisMonthTx.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const actualSavingsThisMonth = (salary + thisMonthIncome) - thisMonthExpense;

  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

  const monthsSet = new Set(transactions.map(t => {
    const d = new Date(t.date);
    return `${d.getFullYear()}-${d.getMonth()}`;
  }));
  const monthsTracked = Math.max(monthsSet.size, 1);
  const avgMonthlySavings = (salary - (totalExpense / monthsTracked)) || 0;

  const categoryMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
  });
  const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

  const goalPercent = savingsGoal > 0 ? Math.round((actualSavingsThisMonth / savingsGoal) * 100) : 0;
  const monthsToEmergencyTarget = avgMonthlySavings > 0 ? Math.ceil(emergencyTarget / avgMonthlySavings) : null;
  const yearProjection = avgMonthlySavings * 12;
  const onTrack = actualSavingsThisMonth >= savingsGoal;
  const isDeficit = thisMonthExpense > (salary + thisMonthIncome);

  const card = { background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" };
  const cardTitle = { fontSize: "15px", fontWeight: 600, color: "#1a1a1a", margin: "0 0 1rem" };
  const row = { fontSize: "13px", color: "#6b7280", margin: "0 0 8px", lineHeight: 1.6 };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7fb", fontFamily: "'Inter', -apple-system, sans-serif", padding: "24px" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 38, height: 38, borderRadius: "10px", background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: 600 }}>
            S
          </div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "16px", color: "#1a1a1a" }}>Smart insights</p>
        </div>
        <Link to="/dashboard" style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#374151", borderRadius: "10px", padding: "9px 16px", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>
          Back to dashboard
        </Link>
      </div>

      {salary === 0 ? (
        <div style={card}>
          <p style={row}>No salary data found. <Link to="/profile" style={{ color: PURPLE, fontWeight: 600 }}>Set up your profile</Link> first to get personalized insights.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          <div style={card}>
            <p style={cardTitle}>This month's status</p>
            <p style={row}>Salary: ₹{salary.toLocaleString()}</p>
            <p style={row}>Extra income: ₹{thisMonthIncome.toLocaleString()}</p>
            <p style={row}>Total expense: ₹{thisMonthExpense.toLocaleString()}</p>
            <p style={{ fontSize: "20px", fontWeight: 600, color: actualSavingsThisMonth >= 0 ? GREEN : RED, marginTop: "10px" }}>
              {actualSavingsThisMonth >= 0 ? "Saved" : "Deficit"}: ₹{Math.abs(actualSavingsThisMonth).toLocaleString()}
            </p>
            {isDeficit && (
              <div style={{ background: "#fef2f2", color: RED, padding: "8px 12px", borderRadius: "8px", fontSize: "12px", marginTop: "10px" }}>
                You are spending more than you earn this month.
              </div>
            )}
          </div>

          <div style={card}>
            <p style={cardTitle}>Savings goal progress</p>
            <p style={row}>Goal: ₹{savingsGoal.toLocaleString()}/month</p>
            <p style={row}>Achieved: ₹{actualSavingsThisMonth.toLocaleString()} ({goalPercent}%)</p>
            <div style={{ background: "#f3f4f6", borderRadius: "99px", height: "10px", marginTop: "12px", overflow: "hidden" }}>
              <div style={{ background: onTrack ? GREEN : AMBER, height: "100%", width: `${Math.min(Math.max(goalPercent, 0), 100)}%` }}></div>
            </div>
            <p style={{ fontSize: "12px", color: onTrack ? GREEN : AMBER, marginTop: "10px", fontWeight: 500 }}>
              {onTrack ? "On track — great job!" : "Behind goal — consider reducing discretionary spending"}
            </p>
          </div>

          <div style={card}>
            <p style={cardTitle}>Spending insight</p>
            {topCategory ? (
              <>
                <p style={row}>Top category: <strong style={{ color: "#1a1a1a" }}>{topCategory[0]}</strong></p>
                <p style={row}>Amount: ₹{topCategory[1].toLocaleString()}</p>
                <div style={{ background: "#f3f0ff", color: "#4c1d95", padding: "10px 12px", borderRadius: "8px", fontSize: "12px", marginTop: "8px" }}>
                  Reducing "{topCategory[0]}" spending by 10% would save you an extra ₹{(topCategory[1] * 0.1).toLocaleString()}/month.
                </div>
              </>
            ) : (
              <p style={row}>No expense data yet. Add transactions to see insights.</p>
            )}
          </div>

          <div style={card}>
            <p style={cardTitle}>Emergency fund projection</p>
            <p style={row}>Target: ₹{emergencyTarget.toLocaleString()}</p>
            <p style={row}>Avg monthly savings: ₹{Math.max(avgMonthlySavings, 0).toLocaleString()}</p>
            {monthsToEmergencyTarget ? (
              <div style={{ background: "#f0fdf4", color: GREEN, padding: "10px 12px", borderRadius: "8px", fontSize: "12px", marginTop: "8px" }}>
                At this rate, you'll reach your emergency fund target in <strong>{monthsToEmergencyTarget} months</strong>.
              </div>
            ) : (
              <div style={{ background: "#fef2f2", color: RED, padding: "10px 12px", borderRadius: "8px", fontSize: "12px", marginTop: "8px" }}>
                Increase savings to start building your emergency fund.
              </div>
            )}
          </div>

          <div style={{ ...card, gridColumn: "1 / -1" }}>
            <p style={cardTitle}>One year projection</p>
            <p style={row}>Based on your current average monthly savings of ₹{Math.max(avgMonthlySavings, 0).toLocaleString()}:</p>
            <p style={{ fontSize: "32px", fontWeight: 600, color: PURPLE, margin: "8px 0" }}>
              ₹{Math.max(yearProjection, 0).toLocaleString()}
            </p>
            <p style={{ fontSize: "11px", color: "#9ca3af" }}>
              Estimated based on historical data. Actual results depend on consistent saving habits.
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default Insights;