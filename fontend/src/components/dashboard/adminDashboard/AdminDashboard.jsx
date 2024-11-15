import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import { FaUserDoctor } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";
import { FcManager } from "react-icons/fc";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getAccessToken();
        const response = await useAxios.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data.dashData);
        console.log(response.data.dashData.latestAppointments);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        navigate("/login"); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [useAxios, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white shadow rounded-lg flex items-center justify-center gap-4">
          <div>
            <FaUserDoctor className="w-8 h-8 text-[#47ccc8]" />
          </div>
          <div>
            <p className="text-2xl font-bold">{dashboardData.doctors}</p>
            <h3 className="text-lg font-semibold">Doctors</h3>
          </div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg flex items-center justify-center gap-4">
          <div>
            <FaBook className="w-8 h-8 text-[#47ccc8]" />
          </div>
          <div>
            <p className="text-2xl">{dashboardData.patients}</p>
            <h3 className="text-lg font-semibold">Patients</h3>
          </div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg flex items-center justify-center gap-4">
          <div>
            <FcManager className="w-8 h-8 text-[#47ccc8]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Appointments</h3>
            <p className="text-2xl">{dashboardData.appointments}</p>
          </div>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold">Latest Appointments</h3>
          {dashboardData.latestAppointments.length > 0 ? (
            <ul>
              {dashboardData.latestAppointments.map((appointment) => (
                <li key={appointment._id}>
                  <p>
                    {appointment.userData.name} -{" "}
                    {new Date(appointment.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent appointments</p>
          )}
        </div>
      </div>
    </div>
  );
}
