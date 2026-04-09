import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: ""
  });
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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setMsg("");
    setMsgType("");
    // Frontend validation for blank fields
    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.age.trim() || !form.weight.trim() || !form.height.trim()) {
      setMsg("All fields are required");
      setMsgType("error");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/auth/register", form);
      console.log(res.data);
      setMsg("Register success");
      setMsgType("success");
    } catch (err) {
      // Log the error for debugging
      console.log('Registration error:', err.response ? err.response.data : err);
      let backendMsg = '';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          backendMsg = err.response.data;
        } else if (err.response.data.message) {
          backendMsg = err.response.data.message;
        }
      }
      if (backendMsg.toLowerCase().includes('user already exists')) {
        setMsg("User already exists");
        setMsgType("error");
      } else {
        setMsg("Register failed");
        setMsgType("error");
      }
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={{marginBottom: 24}}>Register</h2>
      <input style={inputStyle} name="name" placeholder="Name" onChange={handleChange} />
      <input style={inputStyle} name="email" placeholder="Email" onChange={handleChange} />
      <input style={inputStyle} name="password" placeholder="Password" type="password" onChange={handleChange} />
      <input style={inputStyle} name="age" placeholder="Age" onChange={handleChange} />
      <input style={inputStyle} name="weight" placeholder="Weight" onChange={handleChange} />
      <input style={inputStyle} name="height" placeholder="Height" onChange={handleChange} />
      <button style={buttonStyle} onClick={handleRegister}>Register</button>
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

export default Register;
