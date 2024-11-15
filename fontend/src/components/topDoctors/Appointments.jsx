import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../Hook/useAxios";
import Swal from "sweetalert2";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const res = await useAxios.get(`/doctor/doctor-details/${doctorId}`);
        setDoctor(res.data.doctor);
        setAvailableSlots(res.data.doctor.slots_booked);
      } catch (error) {
        console.error("Error fetching doctor booking", error);
      }
    };
    fetchDoctorDetails();
  }, [doctorId]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Booking failed",
        text: "Please select both date and time slot.",
        showConfirmButton: true,
      });
      return;
    }

    try {
      const res = await useAxios.post(`/users/book-appointment`, {
        doctorId,
        date: selectedDate,
        time: selectedTime,
      });

      if (res.data.success) {
        setConfirmation("Your appointment has been booked successfully.");
        setAvailableSlots((prevSlots) => {
          const updatedSlots = { ...prevSlots };
          updatedSlots[selectedDate] = updatedSlots[selectedDate].filter(
            (slot) => slot !== selectedTime
          );
          return updatedSlots;
        });
      } else {
        setConfirmation("Failed to book the appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment", error);
      setConfirmation("Failed to book the appointment. Please try again.");
    }
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-10 bg-white shadow-lg rounded-lg p-8">
        <div className="md:w-1/3">
          <img
            src={doctor.image || "/path_to_placeholder_image.jpg"}
            alt={`Profile of Dr. ${doctor.name}`}
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-teal-600 mb-2">
            Dr. {doctor.name}
          </h1>
          <p className="text-lg text-gray-700 mb-4">{doctor.degree}</p>
          <p className="text-gray-600 mb-4">{doctor.about}</p>
          <p className="text-lg font-semibold text-teal-700 mb-2">
            Specialty: {doctor.speciality}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Experience:</span>{" "}
            {doctor.experience} years
          </p>
          <p className="mb-4">
            <span className="font-semibold">Fees:</span> {doctor.fees} taka
          </p>
          <div className="flex items-center mb-6">
            <span
              className={`${
                doctor.available ? "bg-green-500" : "bg-red-500"
              } w-3 h-3 rounded-full mr-2`}
            ></span>
            <span>{doctor.available ? "Available" : "Unavailable"}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="date" className="block font-semibold text-gray-700">
          Select Date:
        </label>
        <select
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="mt-2 w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
        >
          <option value="">-- Select Date --</option>
          {Object.keys(availableSlots).map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {selectedDate && (
        <div className="mt-4">
          <label htmlFor="time" className="block font-semibold text-gray-700">
            Select Time:
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className="mt-2 w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">-- Select Time --</option>
            {availableSlots[selectedDate]?.length > 0 ? (
              availableSlots[selectedDate].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))
            ) : (
              <option value="">No slots available</option>
            )}
          </select>
        </div>
      )}

      <button
        onClick={handleBooking}
        className="mt-6 w-full md:w-1/2 bg-teal-500 hover:bg-blue-950 hover:text-white font-semibold py-3 rounded-md shadow-md transition-all duration-200"
      >
        Book Appointment
      </button>

      {confirmation && (
        <p className="mt-4 text-center text-red-600 font-semibold">
          {confirmation}
        </p>
      )}
    </div>
  );
}
