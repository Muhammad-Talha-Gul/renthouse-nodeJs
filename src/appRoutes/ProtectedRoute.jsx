import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { authSession } from "../services/authSession";

const ProtectedRoute = ({ element }) => {
  const token = authSession.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      authSession.clearSession();
      return <Navigate to="/login" replace />;
    }

    return element;
  } catch (error) {
    // If token is invalid
     const token = authSession.clearSession();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;