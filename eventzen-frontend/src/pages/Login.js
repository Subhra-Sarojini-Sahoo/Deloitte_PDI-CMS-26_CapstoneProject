import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      const response = await axios.post("http://localhost:8081/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userRole", response.data.role);

      if (response.data.role === "CUSTOMER") {
        navigate("/customer-dashboard");
      } else if (response.data.role === "VENDOR") {
        navigate("/vendor-dashboard");
      } else {
        navigate("/admin-dashboard");
      }

    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed .Wrong password or email entered");
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1>Welcome back!</h1>
        <p>You can sign in to access your account.</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <h2>Sign In</h2>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        {message && <p className="error-text">{message}</p>}

        <p className="register-link">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Create one
          </span>
        </p>
      </div>

    </div>
  );
}

export default Login;