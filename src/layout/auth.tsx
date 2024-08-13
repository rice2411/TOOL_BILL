import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Đăng nhập</h2>
        <Outlet />
      </div>
    </div>
  );
};
