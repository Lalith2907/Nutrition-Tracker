import React, { useState } from "react";
import axios from "axios";

function Report() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [userName, setUserName] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!start || !end || !userName) {
      setError("All fields are required.");
      return;
    }
    try {
      const res = await axios.get(
        `/api/report/summary?start=${start}&end=${end}&userName=${encodeURIComponent(userName)}`
      );
      setResult(res.data);
    } catch (err) {
      setError("Failed to fetch report.");
    }
  };

  return (
    <div className="report-container">
      <h2>Nutrition Report</h2>
      <form onSubmit={handleSubmit}>
        <label>Start Date: <input type="date" value={start} onChange={e => setStart(e.target.value)} /></label><br/>
        <label>End Date: <input type="date" value={end} onChange={e => setEnd(e.target.value)} /></label><br/>
        <label>User Name: <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter user name" /></label><br/>
        <button type="submit">Get Report</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
      {result && (
        <div className="report-result">
          <h3>Report Result</h3>
          <p>Total Calories: {result.totalCalories}</p>
        </div>
      )}
    </div>
  );
}

export default Report;
