// ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = (props: any) => {
  const { user }: any = useAuth();
  return user ? { ...props.children } : <Navigate to="/login" />;
};

export default ProtectedRoute;
