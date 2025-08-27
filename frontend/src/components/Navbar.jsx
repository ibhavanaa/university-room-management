import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    localStorage.removeItem("role");  // remove role info
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* Project Name / Logo */}
      <h1 
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
      >
        University Infra Management
      </h1>

      {/* Right side */}
      <div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
