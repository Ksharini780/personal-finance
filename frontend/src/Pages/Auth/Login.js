import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";
import BackgroundImage from "../../assets/background.jpg";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap import

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const { data } = await axios.post(loginAPI, values);
      console.log("Login API Response:", data); // ✅ Log API Response
  
      if (data && data.token) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
  
        console.log("Redirecting to /dashboard..."); // ✅ Debugging log
  
        setTimeout(() => {
          window.location.href = "/dashboard"; // ✅ Force redirect
        }, 1000);
        
      } else {
        toast.error(data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card p-4 text-white"
        style={{
          width: "350px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          borderRadius: "12px",
        }}
      >
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={values.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={values.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Processing..." : "Login"}
          </button>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register" className="text-light">Sign Up</Link>
          </p>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} theme="dark" />
    </div>
  );
};

export default Login;

