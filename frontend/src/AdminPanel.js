import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [report, setReport] = useState({ totalUsers: 0, totalMeals: 0, avgCalories: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsersAndReport = async () => {
    try {
      const [usersRes, reportRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/users"),
        axios.get("http://localhost:8080/api/admin/report")
      ]);
      setUsers(usersRes.data);
      setReport(reportRes.data);
    } catch (err) {
      setError("Failed to fetch admin data.");
    }
  };

  useEffect(() => {
    fetchUsersAndReport();
  }, []);

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${id}`);
      setSuccess("User deleted successfully.");
      // Refresh both users and report metrics after deletion
      fetchUsersAndReport();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    padding: "24px",
    flex: "1",
    textAlign: "center",
    minWidth: "150px"
  };

  const statsContainerStyle = {
    display: "flex",
    gap: "24px",
    marginBottom: "40px",
    flexWrap: "wrap"
  };

  const valueStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1976d2",
    margin: "8px 0"
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", display: "flex", flexDirection: "column" }}>
      <h2 style={{ textAlign: "center", marginBottom: "32px", color: "#1e293b", fontSize: "28px" }}>System Admin Dashboard</h2>
      
      {/* 1. SYSTEM REPORT LAYER */}
      <h3 style={{ color: "#333", marginBottom: "16px", borderBottom: "2px solid #eee", paddingBottom: "8px" }}>System Report</h3>
      <div style={statsContainerStyle}>
        <div style={cardStyle}>
          <div style={{ color: "#666", fontWeight: "600", textTransform: "uppercase", fontSize: "14px" }}>Total Users</div>
          <div style={valueStyle}>{report.totalUsers}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: "#666", fontWeight: "600", textTransform: "uppercase", fontSize: "14px" }}>Total Meals Logged</div>
          <div style={valueStyle}>{report.totalMeals}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: "#666", fontWeight: "600", textTransform: "uppercase", fontSize: "14px" }}>Avg Calories / Meal</div>
          <div style={valueStyle}>{Math.round(report.avgCalories || 0)}</div>
        </div>
      </div>

      {/* 2. USER MANAGEMENT LAYER */}
      <h3 style={{ color: "#333", marginBottom: "16px", borderBottom: "2px solid #eee", paddingBottom: "8px" }}>User Management</h3>
      {error && <div style={{ color: '#b71c1c', background: '#fdecea', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}
      {success && <div style={{ color: '#137333', background: '#e6f4ea', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{success}</div>}
      
      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #eaeaea" }}>
            <tr>
              <th style={{ padding: "16px", color: "#333" }}>User ID</th>
              <th style={{ padding: "16px", color: "#333" }}>Name</th>
              <th style={{ padding: "16px", color: "#333" }}>Email</th>
              <th style={{ padding: "16px", color: "#333" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "16px" }}>{user.userId}</td>
                <td style={{ padding: "16px", fontWeight: "500" }}>{user.name}</td>
                <td style={{ padding: "16px", color: "#666" }}>{user.email}</td>
                <td style={{ padding: "16px" }}>
                  {user.email !== "admin" && (
                    <button 
                      style={{ background: "#dc3545", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }} 
                      onClick={() => handleDelete(user.userId)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                 <td colSpan="4" style={{ padding: "24px", textAlign: "center", color: "#777" }}>No users found in the system.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;
