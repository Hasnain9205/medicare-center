import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";

export default function UpdateDoctor() {
  const { id } = useParams(); // Get doctor ID from URL
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    degree: "",
    speciality: "",
    fees: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = getAccessToken();
        const response = await useAxios.get(`/admin/doctor/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setDoctor(response.data);
      } catch (err) {
        setError("Error fetching doctor details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await useAxios.put(`/admin/update-doctor/${id}`, doctor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Doctor updated successfully!");
      navigate("/admin/doctors");
    } catch (err) {
      setError("Error updating doctor.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
        Update Doctor
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={doctor.name}
            onChange={handleChange}
            className="block w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={doctor.email}
            onChange={handleChange}
            className="block w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </div>

        <div>
          <label
            htmlFor="degree"
            className="block text-sm font-medium text-gray-700"
          >
            Degree
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={doctor.degree}
            onChange={handleChange}
            className="block w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label
            htmlFor="speciality"
            className="block text-sm font-medium text-gray-700"
          >
            Speciality
          </label>
          <input
            type="text"
            id="speciality"
            name="speciality"
            value={doctor.speciality}
            onChange={handleChange}
            className="block w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label
            htmlFor="fees"
            className="block text-sm font-medium text-gray-700"
          >
            Fees
          </label>
          <input
            type="number"
            id="fees"
            name="fees"
            value={doctor.fees}
            onChange={handleChange}
            className="block w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Update Doctor
        </button>
      </form>
    </div>
  );
}
