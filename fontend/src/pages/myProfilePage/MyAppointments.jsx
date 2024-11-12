import { useContext, useEffect, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";
import { AuthContext } from "../../components/provider/AuthProvider";

export default function MyAppointments() {
  const [myAppointments, setMyAppointments] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?._id) return;

      try {
        const token = getAccessToken();
        const response = await useAxios.get("/users/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: user._id,
          },
        });

        if (response.data && response.data.appointments) {
          const parsedAppointments = response.data.appointments.map(
            (appointment) => {
              try {
                return {
                  ...appointment,
                  docData: JSON.parse(appointment.docData),
                };
              } catch (error) {
                console.error(
                  "Error parsing docData:",
                  error,
                  appointment.docData
                );
                return appointment;
              }
            }
          );

          setMyAppointments(parsedAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]);

  return (
    <div className="mt-20">
      <h1 className="font-bold text-xl border-b-2 pb-6">My Appointments</h1>
      <div className="appointment-list mt-4">
        {myAppointments.length > 0 ? (
          myAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="appointment-card p-4 border rounded-lg mb-4 flex items-center"
            >
              <div className="appointment-image">
                <img
                  src={appointment.docData?.image || "default-image-url"}
                  alt="Doctor"
                  className="w-16 h-16 rounded-full"
                />
              </div>
              <div className="appointment-info ml-4">
                <h2 className="font-semibold">
                  {appointment.docData?.name || "Doctor Name"}
                </h2>
                <p>Date: {appointment.slotDate}</p>
                <p>Time: {appointment.slotTime}</p>
                <p>
                  Status: {appointment.cancelled ? "Cancelled" : "Confirmed"}
                </p>
              </div>
              <div className="appointment-action ml-auto">
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Cancel Appointment
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
}
