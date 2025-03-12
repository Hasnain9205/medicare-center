import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export const DiagnosticDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setupCharts = (data) => {
    const revenueCtx = document
      .getElementById("revenueChart")
      ?.getContext("2d");
    const costCtx = document.getElementById("costChart")?.getContext("2d");
    const appointmentsCtx = document
      .getElementById("appointmentsChart")
      ?.getContext("2d");
    const countsCtx = document.getElementById("countsChart")?.getContext("2d");

    if (revenueCtx) {
      new Chart(revenueCtx, {
        type: "bar",
        data: {
          labels: ["Revenue", "Cost"],
          datasets: [
            {
              label: "Amount ($)",
              data: [data.totalRevenue, data.totalCost],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
              ],
            },
          ],
        },
      });
    }

    if (appointmentsCtx) {
      new Chart(appointmentsCtx, {
        type: "doughnut",
        data: {
          labels: ["Test Appointments", "Doctor Appointments"],
          datasets: [
            {
              label: "Appointments",
              data: [data.totalTestAppointments, data.totalDoctorAppointments],
              backgroundColor: [
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
            },
          ],
        },
      });
    }

    if (countsCtx) {
      new Chart(countsCtx, {
        type: "pie",
        data: {
          labels: ["Doctors", "Tests", "Employees"],
          datasets: [
            {
              label: "Counts",
              data: [data.doctorCount, data.testCount, data.totalEmployees],
              backgroundColor: [
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
                "rgba(75, 192, 192, 0.6)",
              ],
            },
          ],
        },
      });
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const centerId = user?.centerId;
        const token = getAccessToken();
        if (!token || !centerId) {
          Swal.fire({
            title: "Unauthorized!",
            text: "Please login to access the dashboard.",
            icon: "warning",
            confirmButtonText: "Go to Login",
          });
          navigate("/login");
          return;
        }
        const response = await useAxios.get(
          `/diagnostic/dashboard/${centerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        Swal.fire({
          title: "Error!",
          text:
            error.response?.data?.message || "Failed to load dashboard data.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, user]);

  useEffect(() => {
    if (dashboardData) {
      setupCharts(dashboardData);
    }
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-blue-500 animate-bounce">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 lg:p-6">
      <div className="container lg:mx-auto bg-white rounded-lg shadow-lg p-2">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Diagnostic Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Revenue"
            value={`$${dashboardData.totalRevenue}`}
            color="blue"
          />
          <DashboardCard
            title="Total Cost"
            value={`$${dashboardData.totalCost}`}
            color="red"
          />
          <DashboardCard
            title="Test Appointments"
            value={dashboardData.totalTestAppointments}
            color="yellow"
          />
          <DashboardCard
            title="Doctor Appointments"
            value={dashboardData.totalDoctorAppointments}
            color="purple"
          />
          <DashboardCard
            title="Total Employees"
            value={dashboardData.employeeCount}
            color="green"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartContainer id="revenueChart" />
          <ChartContainer id="appointmentsChart" />
          <ChartContainer id="countsChart" />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, color }) => (
  <div className={`p-4 bg-${color}-100 text-${color}-700 rounded-lg shadow`}>
    <p className="text-lg font-semibold">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

const ChartContainer = ({ id }) => (
  <div className="bg-white shadow-lg rounded-lg p-4">
    <canvas id={id}></canvas>
  </div>
);
