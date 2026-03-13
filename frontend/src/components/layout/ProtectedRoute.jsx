import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

export function ProtectedRoute({ children, adminOnly = false }) {
  // Grab user and isAdmin from your Context
  const { user, isAdmin } = useAuth();

  // 1. If there is no user logged in, kick them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If this page requires Admin access (like Dashboard), but they aren't an admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />; // Kick normal users back to storefront
  }

  // If they pass the checks, let them view the page!
  return children;
}
