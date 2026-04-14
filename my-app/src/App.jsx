import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Watchlist from "./pages/Watchlist";

function App() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* ✅ ADD THIS */}
        <Route
          path="/watchlist"
          element={isLoggedIn ? <Watchlist /> : <Navigate to="/login" />}
        />

        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;