import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        
        {/* 🎬 Title */}
        <h1 className="text-3xl font-bold mb-2">
          🎬 Movie Hub
        </h1>

        <p className="text-gray-400 mb-6">
          Discover, save, and track your favorite movies
        </p>

        {/* 🎥 Browse Movies */}
        <button
          onClick={() => navigate("/watchlist")}
          className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
        >
          🍿 Browse Movies
        </button>

        {/* 📌 Watchlist */}
        <button
          onClick={() => navigate("/watchlist")}
          className="w-full bg-gray-700 py-3 rounded-lg hover:bg-gray-600 transition mb-6"
        >
          📌 View Watchlist
        </button>

        {/* 🚪 Logout */}
        <button
          onClick={logout}
          className="text-red-400 hover:text-red-500 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;