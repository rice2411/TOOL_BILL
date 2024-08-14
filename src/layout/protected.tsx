import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { IAuthContext } from "../interface";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth() as unknown as IAuthContext;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
