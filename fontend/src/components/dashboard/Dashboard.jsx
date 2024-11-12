import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Link } from "react-router-dom";
import AddDoctor from "./adminDashboard/AddDoctor";
import AllDoctor from "./adminDashboard/AllDoctor";
import Settings from "./settings/Settings";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState("");

  const renderContent = () => {
    switch (currentPage) {
      case "addDoctor":
        return <AddDoctor />;
      case "allDoctors":
        return <AllDoctor />;
      case "settings":
        return <Settings />;
      default:
        return <div>Select an option from the menu.</div>;
    }
  };

  return (
    <div className="flex">
      <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <a href="#" className="mx-auto">
          <img
            className="w-auto h-6 sm:h-7"
            src="https://merakiui.com/images/full-logo.svg"
            alt="Logo"
          />
        </a>

        <div className="flex flex-col items-center mt-6 -mx-2">
          <img
            className="object-cover w-24 h-24 mx-2 rounded-full"
            src={user?.profileImage || "path/to/default/image.png"} // Default image path
            alt="Profile"
          />
          <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">
            {user?.name}
          </h4>
          <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            <Link
              to="#"
              onClick={() => setCurrentPage("")}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200"
            >
              <span className="mx-4 font-medium">Admin Dashboard</span>
            </Link>

            <Link
              to="#"
              onClick={() => setCurrentPage("addDoctor")}
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <span className="mx-4 font-medium">Add Doctor</span>
            </Link>

            <Link
              to="#"
              onClick={() => setCurrentPage("allDoctors")}
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <span className="mx-4 font-medium">All Doctors</span>
            </Link>

            <Link
              to="#"
              onClick={() => setCurrentPage("settings")}
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <span className="mx-4 font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6">
        {renderContent()} {/* Render the appropriate content based on state */}
      </main>
    </div>
  );
}
