import { logOut } from "../../services/firebase";
import Button from "../Button";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { IAuthContext } from "../../interface";

function Header() {
  const { user } = useAuth() as unknown as IAuthContext;
  const location = useLocation(); // Sử dụng useLocation để lấy thông tin về URL hiện tại
  const activeTab = location.pathname;
  return (
    <header className="bg-white shadow-md py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">My App</div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              <p>{user?.displayName || ""}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <Button
              text="Logout"
              onClick={logOut}
              className="py-2 px-4 !bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            />
          </div>
        </div>
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-6">
            <Link
              to="/"
              className={`py-2 px-4 text-sm font-medium rounded-md ${
                activeTab === "/"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Danh sách hóa đơn
            </Link>
            <Link
              to="/create-expense"
              className={`py-2 px-4 text-sm font-medium rounded-md ${
                activeTab === "/create-expense"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tạo chi tiêu
            </Link>
            <Link
              to="/create-invoice"
              className={`py-2 px-4 text-sm font-medium rounded-md ${
                activeTab === "/create-invoice"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tạo hóa đơn
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
