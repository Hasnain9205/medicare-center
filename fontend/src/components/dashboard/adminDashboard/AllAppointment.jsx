import { useEffect, useState } from "react";
import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";

const AllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all appointments
    const token = getAccessToken();
    useAxios
      .get("/admin/all-appointment", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAppointments(response.data.appointments);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments", error);
      });
  }, []);

  const cancelAppointment = async (appointmentId) => {
    const token = getAccessToken();
    await useAxios
      .post(
        "/admin/cancel-appointment",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        alert(response.data.message);
        // Refresh the appointments list
        setAppointments((prevAppointments) =>
          prevAppointments.filter((app) => app._id !== appointmentId)
        );
      })
      .catch((error) => {
        console.error("Error cancelling appointment", error);
      });
  };

  return (
    <div className="">
      <h2 className="text-3xl font-semibold text-gray-800 text-center">
        Doctors Appointment
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Slot Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Slot Time
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
                    {appointment.userData.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.docData.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.slotDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.slotTime}
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

export default AllAppointment;
