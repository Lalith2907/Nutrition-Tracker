import React, { useState, useEffect } from "react";
import axios from "axios";

function Report({ user }) {
  const getToday = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };
  const getDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const [dateRange, setDateRange] = useState("today");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async (startDate, endDate) => {
    if (!user || !user.name) return;
    setError("");
    setResult(null);
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/report/summary?start=${startDate}&end=${endDate}&userName=${encodeURIComponent(user.name)}`
      );
      setResult(res.data);
    } catch (err) {
      setError("Failed to fetch report.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let s = getToday();
    const e = getToday();
    if (dateRange === "today") {
      s = getToday();
    } else if (dateRange === "week") {
      s = getDaysAgo(7);
    } else if (dateRange === "month") {
      s = getDaysAgo(30);
    }
    
    if (dateRange !== "custom") {
      setStart(s);
      setEnd(e);
      fetchReport(s, e);
    }
  }, [dateRange, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchReport(start, end);
  };

  const btnStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    background: isActive ? '#3498db' : '#ecf0f1',
    color: isActive ? '#fff' : '#2c3e50',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: '0.2s'
  });

  return (
    <div className="report-container" style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h2 style={{ color: '#2c3e50', textAlign: 'center', justifyContent: 'center', marginBottom: '24px' }}>Hey {user?.name}, here is your Nutrition Report</h2>
      
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button style={btnStyle(dateRange === 'today')} onClick={() => setDateRange('today')}>Today</button>
        <button style={btnStyle(dateRange === 'week')} onClick={() => setDateRange('week')}>Last 7 Days</button>
        <button style={btnStyle(dateRange === 'month')} onClick={() => setDateRange('month')}>Last 30 Days</button>
        <button style={btnStyle(dateRange === 'custom')} onClick={() => setDateRange('custom')}>Custom Range</button>
      </div>

      {dateRange === 'custom' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'flex-end', marginBottom: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px', fontWeight: 'bold' }}>Start Date</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', height: '38px', boxSizing: 'border-box' }} required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px', fontWeight: 'bold' }}>End Date</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', height: '38px', boxSizing: 'border-box' }} required />
          </div>
          <button type="submit" style={{ padding: '0 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', height: '38px', boxSizing: 'border-box' }}>Fetch Data</button>
        </form>
      )}

      {isLoading && <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>Loading analysis...</div>}
      {error && <div style={{ color: '#e74c3c', textAlign: 'center', padding: '10px', backgroundColor: '#fdedec', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}
      
      {!isLoading && result && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginTop: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '12px', marginBottom: '24px', fontSize: '22px' }}>Detailed Nutrition Analysis</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Calories</span>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '8px' }}>
                <strong style={{ fontSize: '36px', color: '#2c3e50', lineHeight: '1' }}>{result.totalCalories || 0}</strong>
                {result.targetCalories > 0 && <span style={{ fontSize: '16px', color: '#95a5a6', marginLeft: '8px' }}>/ {result.targetCalories} kcal</span>}
              </div>
              {result.targetCalories > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ height: '6px', backgroundColor: '#ecf0f1', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((result.totalCalories / result.targetCalories) * 100, 100)}%`, height: '100%', backgroundColor: result.totalCalories > result.targetCalories ? '#e74c3c' : '#3498db' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7f8c8d', marginTop: '6px' }}>
                    <span>{Math.round((result.totalCalories / result.targetCalories) * 100)}% Consumed</span>
                    <span style={{ color: result.caloriesLeft < 0 ? '#e74c3c' : '#27ae60', fontWeight: 'bold' }}>
                      {Math.abs(result.caloriesLeft)} {result.caloriesLeft < 0 ? 'Over' : 'Remaining'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h4 style={{ color: '#34495e', marginBottom: '16px', fontSize: '18px' }}>Macronutrient Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            
            {/* Protein */}
            <div style={{ border: '1px solid #e1e8ed', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: (result.totalProtein || 0) > result.targetProtein ? '#e74c3c' : '#3498db', borderRadius: '50%' }}></div>
                  <strong style={{ color: '#2c3e50', fontSize: '16px' }}>Protein</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: (result.totalProtein || 0) > result.targetProtein ? '#e74c3c' : '#2c3e50' }}>{result.totalProtein || 0}g</span>
                  {result.targetProtein > 0 && <span style={{ fontSize: '14px', color: '#7f8c8d', marginLeft: '4px' }}>/ {result.targetProtein}g</span>}
                </div>
              </div>
              {result.targetProtein > 0 && (
                <div style={{ height: '8px', backgroundColor: '#ecf0f1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(((result.totalProtein || 0) / result.targetProtein) * 100, 100)}%`, height: '100%', backgroundColor: (result.totalProtein || 0) > result.targetProtein ? '#e74c3c' : '#3498db' }}></div>
                </div>
              )}
            </div>

            {/* Carbs */}
            <div style={{ border: '1px solid #e1e8ed', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: (result.totalCarbs || 0) > result.targetCarbs ? '#e74c3c' : '#2ecc71', borderRadius: '50%' }}></div>
                  <strong style={{ color: '#2c3e50', fontSize: '16px' }}>Carbohydrates</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: (result.totalCarbs || 0) > result.targetCarbs ? '#e74c3c' : '#2c3e50' }}>{result.totalCarbs || 0}g</span>
                  {result.targetCarbs > 0 && <span style={{ fontSize: '14px', color: '#7f8c8d', marginLeft: '4px' }}>/ {result.targetCarbs}g</span>}
                </div>
              </div>
              {result.targetCarbs > 0 && (
                <div style={{ height: '8px', backgroundColor: '#ecf0f1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(((result.totalCarbs || 0) / result.targetCarbs) * 100, 100)}%`, height: '100%', backgroundColor: (result.totalCarbs || 0) > result.targetCarbs ? '#e74c3c' : '#2ecc71' }}></div>
                </div>
              )}
            </div>

            {/* Fats */}
            <div style={{ border: '1px solid #e1e8ed', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: (result.totalFats || 0) > result.targetFats ? '#e74c3c' : '#f1c40f', borderRadius: '50%' }}></div>
                  <strong style={{ color: '#2c3e50', fontSize: '16px' }}>Fats</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: (result.totalFats || 0) > result.targetFats ? '#e74c3c' : '#2c3e50' }}>{result.totalFats || 0}g</span>
                  {result.targetFats > 0 && <span style={{ fontSize: '14px', color: '#7f8c8d', marginLeft: '4px' }}>/ {result.targetFats}g</span>}
                </div>
              </div>
              {result.targetFats > 0 && (
                <div style={{ height: '8px', backgroundColor: '#ecf0f1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(((result.totalFats || 0) / result.targetFats) * 100, 100)}%`, height: '100%', backgroundColor: (result.totalFats || 0) > result.targetFats ? '#e74c3c' : '#f1c40f' }}></div>
                </div>
              )}
            </div>

            {/* Fiber */}
            <div style={{ border: '1px solid #e1e8ed', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: (result.totalFiber || 0) < result.targetFiber ? '#e67e22' : '#9b59b6', borderRadius: '50%' }}></div>
                  <strong style={{ color: '#2c3e50', fontSize: '16px' }}>Fiber</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: (result.totalFiber || 0) < result.targetFiber ? '#e67e22' : '#2c3e50' }}>{result.totalFiber || 0}g</span>
                  {result.targetFiber > 0 && <span style={{ fontSize: '14px', color: '#7f8c8d', marginLeft: '4px' }}>/ {result.targetFiber}g</span>}
                </div>
              </div>
              {result.targetFiber > 0 && (
                <div style={{ height: '8px', backgroundColor: '#ecf0f1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(((result.totalFiber || 0) / result.targetFiber) * 100, 100)}%`, height: '100%', backgroundColor: (result.totalFiber || 0) < result.targetFiber ? '#e67e22' : '#9b59b6' }}></div>
                </div>
              )}
            </div>

          </div>

          {result.targetCalories !== undefined ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '16px', 
              borderRadius: '8px', 
              backgroundColor: result.status === 'Goal Met!' ? '#e8f5e9' : '#ffebee',
              color: result.status === 'Goal Met!' ? '#2e7d32' : '#c62828',
              fontWeight: 'bold',
              fontSize: '16px',
              border: `1px solid ${result.status === 'Goal Met!' ? '#c8e6c9' : '#ffcdd2'}`,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Status: {result.status}
            </div>
          ) : (
            <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ced4da', textAlign: 'center', color: '#7f8c8d', fontStyle: 'italic' }}>
              No calorie/macro goal is currently set for this user.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Report;
