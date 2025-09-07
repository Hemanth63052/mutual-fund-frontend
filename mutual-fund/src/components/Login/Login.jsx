// src/components/auth/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/constants";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);

      if (!(response.status >= 200 && response.status < 300)) {
        throw new Error("Login failed");
      }

      // token may come in headers or response body depending on your backend
      const rawToken =
        response.headers["authorization"] ||
        response.headers["Authorization"] ||
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.access_token;

      if (!rawToken) {
        throw new Error("No token received from server");
      }

      // remove possible "Bearer " prefix
      const token = rawToken.startsWith("Bearer ")
        ? rawToken.split(" ")[1]
        : rawToken;

      // persist token and set default axios header for future requests
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert("Login successful!");
      navigate("/portfolio");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed, please try again.");
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p style={{ marginTop: "10px" }}>Don't have an account?</p>
        <button type="button" onClick={handleSignupRedirect}>
          Signup
        </button>
      </form>
    </div>
  );
}

export default Login;
