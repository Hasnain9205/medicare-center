import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import AddDoctor from "./adminDashboard/AddDoctor";
import AllDoctor from "./adminDashboard/AllDoctor";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import AdminGetAllTest from "./adminDashboard/AdminGetAllTest";
import { AddTest } from "./adminDashboard/AddTest";

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("");

  // Check if user is authenticated and has the role of 'admin'
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "admin") {
        navigate("/login");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, loading, navigate]);

  const renderContent = () => {
    switch (currentPage) {
      case "addDoctor":
        return <AddDoctor />;
      case "allDoctors":
        return <AllDoctor />;
      case "adminDashboard":
        return <AdminDashboard />;
      case "addTest":
        return <AddTest />;
      case "adminGetAllTest":
        return <AdminGetAllTest />;
      case "/role":
        return <AdminGetAllTest />;
      default:
        return <AdminDashboard />;
    }
  };

  if (loading) {
    return <div>Loading.....</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex">
      <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col items-center mt-6 -mx-2">
          <img
            className="object-cover w-24 h-24 mx-2 rounded-full"
            src={user?.profileImage || "path/to/default/image.png"}
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
              onClick={() => setCurrentPage("adminDashboard")}
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
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
              onClick={() => setCurrentPage("addTest")}
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <span className="mx-4 font-medium">Add Test</span>
            </Link>
            <Link
              to="#"
              onClick={() => setCurrentPage("adminGetAllTest")}
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <span className="mx-4 font-medium">All Test</span>
            </Link>
            <Link
              to="#"
              onClick={() => setCurrentPage("allDoctors")}
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <span className="mx-4 font-medium">All Appointment</span>
            </Link>
            <Link
              to="#"
              onClick={() => setCurrentPage("allDoctors")}
              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <span className="mx-4 font-medium">Manage Role</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
}
