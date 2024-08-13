import React, { useState } from "react";
import { logOut } from "../../services/firebase";
import Button from "../Button";
import { useAuth } from "../../hooks/useAuth";

function Header() {
  const { user }: any = useAuth();
  const [activeTab, setActiveTab] = useState("createExpense");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">My App</div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              <p>{user.displayName}</p>
              <p className="text-gray-500">{user.email}</p>
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
            <button
              onClick={() => handleTabClick("createExpense")}
              className={`py-2 px-4 text-sm font-medium rounded-md ${
                activeTab === "createExpense"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tạo chi tiêu
            </button>
            <button
              onClick={() => handleTabClick("createInvoice")}
              className={`py-2 px-4 text-sm font-medium rounded-md ${
                activeTab === "createInvoice"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tạo hóa đơn
            </button>
            <button
              onClick={() => handleTabClick("invoiceList")}
              className={`py-2 px-4 text-sm font-medium rounded-md ${
                activeTab === "invoiceList"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Danh sách hóa đơn
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
