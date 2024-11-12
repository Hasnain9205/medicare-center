import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAxios from "../../Hook/useAxios";

export default function DoctorDetails() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const res = await useAxios.get(`/doctor/doctor-details/${doctorId}`);
        setDoctor(res.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor details", error);
        setError("Failed to load doctor details. Please try again.");
      }
    };
    fetchDoctorDetails();
  }, [doctorId]);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  if (!doctor) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="mt-20 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex gap-6">
          <div className="w-1/3">
            <img
              src={doctor.image || "/path_to_placeholder_image.jpg"}
              alt={doctor.name}
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <div className="w-2/3">
            <h1 className="text-3xl font-bold text-[#47ccc8]">{doctor.name}</h1>
            <p className="text-lg text-gray-600">{doctor.speciality}</p>
            <p className="mt-4 text-gray-700">{doctor.about}</p>
            <p className="mt-4">
              <strong>Experience:</strong> {doctor.experience} years
            </p>
            <p>
              <strong>Fees:</strong> ${doctor.fees}
            </p>
            <div className="flex items-center mt-4">
              <p
                className={`${
                  doctor.available ? "bg-green-500" : "bg-red-500"
                } w-3 h-3 rounded-full mr-2`}
              ></p>
              <p>{doctor.available ? "Available" : "Unavailable"}</p>
            </div>
            <Link
              to={`/bookAppointment/${doctor._id}`}
              className="mt-6 inline-block bg-[#47ccc8] hover:bg-blue-950 text-white px-4 py-2 rounded-md"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mt-6">
        <h2 className="text-2xl font-bold">Doctor's Schedule</h2>
        <p className="text-gray-700">
          Check the available slots below and book your appointment.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {doctor.slots_booked &&
          Object.keys(doctor.slots_booked).length > 0 ? (
            Object.keys(doctor.slots_booked).map((date, index) => {
              const slots = doctor.slots_booked[date];
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    slots.length > 0 ? "bg-green-100" : "bg-red-100"
                  } text-center`}
                >
                  <p>{date}</p>
                  {slots.length > 0 ? (
                    slots.map((slotTime, timeIndex) => (
                      <p key={timeIndex}>{slotTime}</p>
                    ))
                  ) : (
                    <p>No slots available</p>
                  )}
                </div>
              );
            })
          ) : (
            <p>No available slots at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
