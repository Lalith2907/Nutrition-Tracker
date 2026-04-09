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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:8080/auth/register", form);
      console.log(res.data);
      alert("Register success");
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <input name="age" placeholder="Age" onChange={handleChange} />
      <input name="weight" placeholder="Weight" onChange={handleChange} />
      <input name="height" placeholder="Height" onChange={handleChange} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
