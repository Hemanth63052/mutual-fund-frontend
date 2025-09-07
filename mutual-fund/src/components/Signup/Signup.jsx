import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { API_BASE_URL } from "../../config/constants";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
      alert("Signup successful!");
      console.log(response.data);
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Signup failed, please try again.");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />

        <button type="submit">Sign Up</button>

        <p style={{ marginTop: "10px" }}>Already have an account?</p>
        <button type="button" onClick={handleLoginRedirect}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
