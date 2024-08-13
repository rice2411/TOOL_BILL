import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-md mx-auto max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
