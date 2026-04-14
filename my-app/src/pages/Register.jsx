import React, { useState, useEffect } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("/register", formData);
      setSuccess("Account created successfully! Redirecting...");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        {/* 🎬 Title */}
        <h2 className="text-3xl font-bold text-center mb-2">
          🎬 Create Account
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Join and start building your watchlist
        </p>

        {/* ❗ Error */}
        {error && (
          <div className="bg-red-500 text-white text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* ✅ Success */}
        {success && (
          <div className="bg-green-500 text-white text-sm p-2 rounded mb-4 text-center">
            {success}
          </div>
        )}

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-3 mb-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.username}
          onChange={handleChange}
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-semibold transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* Login link */}
        <p className="text-center text-gray-400 mt-5">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;