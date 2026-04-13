
import Login from "./Login";
import Register from "./Register";
import Meal from "./Meal";
import Report from "./Report";
import AdminPanel from "./AdminPanel";
import { useState } from "react";
import "./App.css";


function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("meal");

  const toggleContainer = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 48,
    marginBottom: 16,
    gap: 12
  };
  const toggleBtn = isActive => ({
    padding: '10px 24px',
    borderRadius: 6,
    border: isActive ? '2px solid #1976d2' : '1px solid #bbb',
    background: isActive ? '#1976d2' : '#f5f5f5',
    color: isActive ? '#fff' : '#222',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s'
  });

  return (
    <div>
      {!user && (
        <>
          <div style={toggleContainer}>
            <button style={toggleBtn(showLogin)} onClick={() => setShowLogin(true)}>Login</button>
            <button style={toggleBtn(!showLogin)} onClick={() => setShowLogin(false)}>Register</button>
          </div>
          {showLogin ? <Login onLogin={u => { setUser(u); setPage(u.role === 'admin' ? 'admin' : 'meal'); }} /> : <Register />}
        </>
      )}
      {user && (
        <>
          <div style={{display:'flex', gap:12, justifyContent:'center', margin:'24px 0'}}>
            {user.role === "admin" ? (
              <button style={toggleBtn(page==="admin")} onClick={()=>setPage("admin")}>Admin Panel</button>
            ) : (
              <>
                <button style={toggleBtn(page==="meal")} onClick={()=>setPage("meal")}>Meals</button>
                <button style={toggleBtn(page==="report")} onClick={()=>setPage("report")}>Report</button>
              </>
            )}
            <button style={toggleBtn(false)} onClick={()=>{setUser(null); setPage("meal");}}>Logout</button>
          </div>
          {page === "meal" && <Meal userId={user.userId} />}
          {page === "report" && <Report user={user} />}
          {page === "admin" && user.role === "admin" && <AdminPanel />}
        </>
      )}
    </div>
  );
}

export default App;
