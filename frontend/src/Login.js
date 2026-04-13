import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success' or 'error'

  const cardStyle = {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    padding: 32,
    margin: "64px auto 0 auto",
    maxWidth: 350,
    minWidth: 280,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };
  const inputStyle = {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #bbb",
    marginBottom: 16,
    width: "100%",
    fontSize: 16
  };
  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: 6,
    border: "none",
    background: "#1976d2",
    color: "#fff",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    width: "100%"
  };

  const handleLogin = async () => {
    setMsg("");
    setMsgType("");

    try {
      const res = await axios.post(
        `http://localhost:8080/auth/login?email=${email}&password=${password}`
      );
      if (!res.data || Object.keys(res.data).length === 0) {
        setMsg("Login failed");
        setMsgType("error");
        return;
      }
      setMsg("Login success");
      setMsgType("success");
      if (onLogin) onLogin(res.data);
    } catch (err) {
      setMsg("Login failed");
      setMsgType("error");
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={{marginBottom: 24}}>Login</h2>
      <input style={inputStyle} placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input style={inputStyle} placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button style={buttonStyle} onClick={handleLogin}>Login</button>

      {msg && (
        <div style={{
          marginTop: 16,
          padding: '12px 18px',
          borderRadius: 6,
          background: msgType === 'success' ? '#e6f4ea' : '#fdecea',
          color: msgType === 'success' ? '#137333' : '#b71c1c',
          fontWeight: 600,
          textAlign: 'center',
          border: msgType === 'success' ? '1px solid #b7e1cd' : '1px solid #f5c6cb'
        }}>{msg}</div>
      )}
    </div>
  );
}

export default Login;
