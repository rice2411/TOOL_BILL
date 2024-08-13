// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = (props: any) => {
  const { user }: any = useAuth();
  return user ? { ...props.children } : <Navigate to="/login" />;
};

export default ProtectedRoute;
