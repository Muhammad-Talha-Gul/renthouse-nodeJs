import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token"); // get token from localStorage
  console.log("token console", token);
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the element (admin/dashboard)
  return element;
};

export default ProtectedRoute;
