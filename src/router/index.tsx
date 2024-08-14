import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "../layout/auth";
import LoginPage from "../pages/login";
import ProtectedRoute from "../layout/protected";
import { AuthProvider } from "../hooks/useAuth";
import { MainLayout } from "../layout/main";
import ExpensePage from "../pages/expense";
import { expenseLoader } from "../pages/expense/loader";
import { invoiceLoader } from "../pages/invoice/loader";
import InvoicePage from "../pages/invoice";
import BillPage from "../pages/bill";
import { billLoader } from "../pages/bill/loader";
import HomePage from "../pages/home";
import { homeLoader } from "../pages/home/loader";

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
        path: "/create-expense",
        element: <ExpensePage />,
        loader: expenseLoader,
      },
      {
        path: "/create-invoice",
        element: <InvoicePage />,
        loader: invoiceLoader,
      },
      {
        path: "/bill",
        element: <BillPage />,
        loader: billLoader,
      },
      {
        path: "/",
        element: <HomePage />,
        loader: homeLoader,
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
