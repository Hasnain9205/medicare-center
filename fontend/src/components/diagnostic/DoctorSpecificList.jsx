import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAccessToken } from "../../../Utils";

const DoctorSpecificList = () => {
  const { state: doctors = [] } = useLocation();
  const navigate = useNavigate();
  const { speciality } = useParams();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const { centerId } = useParams();
  console.log("centerId", centerId);
  console.log("doctors", doctors);
  // Apply initial filtering on load
  useEffect(() => {
    setFilteredDoctors(doctors);
    setLoading(false);
  }, [doctors]);

  // Apply filters
  const handleFilter = () => {
    let filtered = doctors;

    if (search) {
      filtered = filtered.filter((doctor) =>
        (doctor.speciality || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (district) {
      filtered = filtered.filter(
        (doctor) =>
          (doctor.district || "").toLowerCase() === district.toLowerCase()
      );
    }

    if (upazila) {
      filtered = filtered.filter(
        (doctor) =>
          (doctor.upazila || "").toLowerCase() === upazila.toLowerCase()
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleBookDoctor = (doctorId) => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
      return;
    }

    navigate(`/appointments/${doctorId}`, {
      state: centerId ? { centerId } : {},
      replace: true,
    });
  };

  return (
    <div className="mt-20">
      <h1 className="text-3xl font-bold text-center text-[#47ccc8]">
        {speciality ? `Doctors Specializing in ${speciality}` : "All Doctors"}
      </h1>

      {/* Filter and search section */}
      <div className="flex gap-4 flex-wrap justify-center space-x-4 mt-8 mb-6">
        <input
          type="text"
          placeholder="Search by speciality"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-lg shadow-md w-72"
        />
        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="p-3 border rounded-lg shadow-md w-72"
        />
        <input
          type="text"
          placeholder="Upazila"
          value={upazila}
          onChange={(e) => setUpazila(e.target.value)}
          className="p-3 border rounded-lg shadow-md w-72"
        />
        <button
          onClick={handleFilter}
          className="bg-[#47ccc8] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      {/* Doctors grid */}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center text-gray-500">
          No doctors found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white shadow-lg rounded-lg p-4 border hover:shadow-xl"
            >
              <img
                src={doctor.profileImage || "/default-image.jpg"}
                alt={doctor.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-lg font-semibold mt-2">{doctor.name}</h2>
              <p className="text-gray-600 mt-1">{doctor.specialty}</p>
              <p className="text-gray-500 text-sm mt-1">
                {doctor.degree} | {doctor.experience} years of experience
              </p>
              <p className="text-gray-500 mt-1">
                {doctor.district}, {doctor.upazila}
              </p>
              <p className="text-gray-700 mt-1">Fees: ${doctor.fees}</p>
              <button
                onClick={() => handleBookDoctor(doctor._id)}
                className="bg-[#47ccc8] text-white px-4 py-2 mt-4 w-full rounded-lg hover:bg-blue-700"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSpecificList;
