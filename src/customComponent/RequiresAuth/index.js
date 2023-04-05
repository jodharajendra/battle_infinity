import { Navigate, useLocation } from "react-router-dom";
import React from "react";

export function RequiresAuth({ children }) {
  const encodedToken = localStorage.getItem("token");
  const location = useLocation();

  console.log(encodedToken);

  return encodedToken ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
