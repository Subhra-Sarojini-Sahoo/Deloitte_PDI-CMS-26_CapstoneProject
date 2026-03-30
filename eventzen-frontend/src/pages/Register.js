import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/auth/register", formData);

      setMessage("Registration successful");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER"
      });

    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-container">

      
      <div className="login-left">
        <h1>Create Account</h1>
        <p>Sign up to get started with EventZen.</p>
      </div>

      
      <div className="login-right">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="login-input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="login-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
                  name="role"
                 className="login-input"
                 value={formData.role}
                 onChange={handleChange}>
        <option value="CUSTOMER">Customer</option>
       <option value="VENDOR">Vendor</option>
          </select>

          <button type="submit" className="login-btn">
            Register
          </button>

        </form>

        {message && <p className="error-text">{message}</p>}

        <p className="register-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Sign In
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;