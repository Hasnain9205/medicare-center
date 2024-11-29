import { useEffect, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2 for alerts
import { getAccessToken } from "../../../Utils";
import { format } from "date-fns"; // For formatting dates

export const MyTestAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch appointments on component load
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = getAccessToken();
        const response = await useAxios.get("/tests/get-test-appointment", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.testAppointments) {
          setAppointments(response.data.testAppointments);
        } else {
          setError("No test appointments found.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(
          err.response?.data?.message || "Failed to fetch appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Calculate total unpaid amount
  const totalAmount = appointments.reduce((total, appointment) => {
    const price = parseFloat(appointment.testId?.price);
    if (!isNaN(price) && appointment.paymentStatus === "unpaid") {
      return total + price;
    }
    return total;
  }, 0);
  console.log(totalAmount);

  // Handle payment for unpaid appointments
  const handlePayTotal = () => {
    const unpaidAppointments = appointments.filter(
      (appointment) => appointment.paymentStatus === "unpaid"
    );
    navigate("/testPayment", { state: { totalAmount, unpaidAppointments } });
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getAccessToken();
          const response = await useAxios.post(
            `/tests/cancel/${appointmentId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setAppointments((prevAppointments) =>
            prevAppointments.filter(
              (appointment) => appointment._id !== appointmentId
            )
          );

          Swal.fire("Cancelled!", response.data.message, "success");
        } catch (err) {
          console.error("Error cancelling appointment:", err);
          Swal.fire("Error!", "Failed to cancel appointment.", "error");
        }
      }
    });
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (appointments.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No appointments found. Book your first test appointment!
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-semibold text-center mb-6">
        My Test Appointments
      </h2>

      <div className="flex justify-between items-center mb-6">
        <p className="text-lg font-bold">Total Amount: ${totalAmount}</p>
        <button
          onClick={handlePayTotal}
          className={`px-6 py-2 rounded-lg ${
            totalAmount > 0
              ? "bg-blue-600 text-white hover:bg-blue-700 transition"
              : "bg-gray-400 text-gray-800 cursor-not-allowed"
          }`}
          disabled={totalAmount === 0}
        >
          Pay Total
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 text-left text-gray-600">Test</th>
              <th className="py-3 px-6 text-left text-gray-600">Category</th>
              <th className="py-3 px-6 text-left text-gray-600">Date</th>
              <th className="py-3 px-6 text-left text-gray-600">Time</th>
              <th className="py-3 px-6 text-left text-gray-600">Price</th>
              <th className="py-3 px-6 text-left text-gray-600">Payment</th>
              <th className="py-3 px-6 text-center text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="border-t border-gray-200">
                <td className="py-4 px-6">{appointment.testId.name}</td>
                <td className="py-4 px-6">{appointment.testId.category}</td>
                <td className="py-4 px-6">
                  {format(
                    new Date(appointment.appointmentDate),
                    "MMM dd, yyyy"
                  )}
                </td>
                <td className="py-4 px-6">{appointment.appointmentTime}</td>
                <td className="py-4 px-6">${appointment.testId.price}</td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      appointment.paymentStatus === "unpaid"
                        ? "bg-yellow-300 text-yellow-800"
                        : "bg-green-300 text-green-800"
                    }`}
                  >
                    {appointment.paymentStatus}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  {appointment.paymentStatus === "unpaid" ? (
                    <button
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      onClick={() => cancelAppointment(appointment._id)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      className="px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                      disabled
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
    </div>
  );
};
