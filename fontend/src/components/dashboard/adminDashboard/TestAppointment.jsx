import { useEffect, useState } from "react";
import { getAccessToken } from "../../../../Utils";
import useAxios from "../../../Hook/useAxios";

const TestAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = getAccessToken();
        const response = await useAxios.get("/tests/get-test-appointment", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("data", response.data.testAppointments);
        setAppointments(response.data.testAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching test appointments", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Cancel appointment function
  const cancelAppointment = async (appointmentId) => {
    try {
      const token = getAccessToken();
      const response = await useAxios.post(
        `/tests/cancel/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
      // Refresh the appointments list
      setAppointments((prevAppointments) =>
        prevAppointments.filter((app) => app._id !== appointmentId)
      );
    } catch (error) {
      console.error("Error cancelling appointment", error);
      alert("Failed to cancel appointment");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-800 text-center">
        Test Appointments
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Test Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Test Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Test Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.testId.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.testId.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.appointmentDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.appointmentTime}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {appointment.status === "pending" && (
                      <button
                        onClick={() => cancelAppointment(appointment._id)}
                        className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                    {appointment.status === "completed" && (
                      <button
                        onClick={() =>
                          alert("Invoice generation functionality")
                        }
                        className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-700 ml-2"
                      >
                        Generate Invoice
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestAppointment;
