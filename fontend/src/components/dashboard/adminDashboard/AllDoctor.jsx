import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useAxios from "../../../Hook/useAxios";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../../../Utils";

export default function AllDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch doctors from the backend API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          setError("Unauthorized access, please login.");
          return;
        }

        const response = await useAxios.get("/admin/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDoctors(response.data.doctors);
      } catch (err) {
        setError("Error fetching doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Delete doctor with SweetAlert2 confirmation
  const deleteDoctor = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = getAccessToken();
        const response = await useAxios.delete(`/admin/delete-doctor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          Swal.fire("Deleted!", "Doctor has been deleted.", "success");
          setDoctors(doctors.filter((doctor) => doctor._id !== id));
        } else {
          Swal.fire("Error!", "Failed to delete doctor.", "error");
        }
      } catch (err) {
        Swal.fire("Error!", "Failed to delete doctor.", "error");
      }
    }
  };

  // Update doctor - Redirect to update page
  const updateDoctor = (id) => {
    navigate(`/update`);
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Doctors List
        </h1>
        <span className="px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
          {doctors.length} doctors
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Degree
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Fees
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900">
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={doctor.image || "https://via.placeholder.com/150"}
                      alt={doctor.name}
                    />
                    <div>
                      <h2 className="font-medium text-gray-800 dark:text-white">
                        {doctor.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor.speciality}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.degree}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.fees}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doctor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => updateDoctor(doctor._id)}
                  >
                    <FaRegEdit className="w-6 h-6" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteDoctor(doctor._id)}
                  >
                    <MdDelete className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300">
          Previous
        </button>
        <button className="px-4 py-2 ml-4 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300">
          Next
        </button>
      </div>
    </div>
  );
}
