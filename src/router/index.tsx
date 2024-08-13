import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "../layout/auth";
import LoginPage from "../pages/login";
import ProtectedRoute from "../layout/protected";
import { AuthProvider } from "../hooks/useAuth";
import HomePage from "../pages/home";
import { homeLoader } from "../pages/home/loader";
import { MainLayout } from "../layout/main";
import { homeAction } from "../pages/home/action";
import ExpensePage from "../pages/expense";
import { expenseLoader } from "../pages/expense/loader";

export default createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <MainLayout></MainLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
    path: "/",
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: homeLoader,
        action: homeAction,
      },
      {
        path: "/expense",
        element: <ExpensePage />,
        loader: expenseLoader,
      },
    ],
  },
  {
    path: "/",
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
