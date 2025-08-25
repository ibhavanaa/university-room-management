import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Extract role from user data
  let userRole = null;
  if (userData) {
    try {
      const user = JSON.parse(userData);
      userRole = user.role;
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  }

  // If roles are specified and user doesn't have the required role
  if (roles && userRole && !roles.includes(userRole)) {
    // Redirect to unauthorized page or their own dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;