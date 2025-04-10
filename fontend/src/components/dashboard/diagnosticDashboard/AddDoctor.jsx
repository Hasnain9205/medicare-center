import { useContext, useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../../Utils";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../provider/AuthProvider";

export default function AddDoctor() {
  const { user } = useContext(AuthContext);
  const centerId = user.centerId;
  console.log("centerId", centerId);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: "",
    speciality: "",
    degree: "",
    experience: "",
    fees: "",
    address: "",
    availableSlots: [],
    district: "",
    upazila: "",
    phone: "",
    services: [],
    website: "",
  });

  const [slot, setSlot] = useState({
    slotDate: "",
    slotTime: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", "First-times-using-cloudinary");
    imageData.append("cloud_name", "dbygmohwb");
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbygmohwb/image/upload",
        {
          method: "POST",
          body: imageData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: data.secure_url,
        }));
        Swal.fire("Success", "Image uploaded successfully", "success");
      } else {
        Swal.fire("Error", "Failed to upload image", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to upload image", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    setSlot({
      ...slot,
      [name]: value,
    });
  };

  const handleAddSlot = () => {
    if (slot.slotDate && slot.slotTime) {
      setFormData({
        ...formData,
        availableSlots: [...formData.availableSlots, slot],
      });
      setSlot({ slotDate: "", slotTime: "" });
      Swal.fire("Success", "Slot added successfully", "success");
    } else {
      Swal.fire(
        "Error",
        "Please provide both date and time for the slot",
        "error"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (formData.fees <= 0) {
      Swal.fire("Error", "Fees must be a positive number", "error");
      return;
    }
    setLoading(true);

    console.log("Form Data before submission:", formData);
    try {
      const token = getAccessToken();
      const response = await axiosInstance.post(
        "/diagnostic/add-doctor",
        { ...formData, centerId },
        {
          "Content-Type": "application/json",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("data", formData);
      if (response.data.success) {
        Swal.fire("Success", "Doctor added successfully", "success");
        setFormData({
          name: "",
          email: "",
          password: "",
          profileImage: "",
          speciality: "",
          degree: "",
          experience: "",
          fees: "",
          address: "",
          slots_booked: [],
          district: "",
          upazila: "",
          phone: "",
          services: [],
          website: "",
        });
      } else {
        const errorMessage = setErrorMessage(response.data.message);
        Swal.fire("Error", errorMessage, "error");
      }
    } catch (error) {
      const serverErrorMessage =
        error.response?.data?.message || "Something went wrong!";
      setErrorMessage(serverErrorMessage);
      Swal.fire("Error", serverErrorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:max-w-4xl  mx-auto mt-8 p-4 bg-white shadow-md rounded-lg dark:bg-gray-800">
      <h2 className="lg:text-3xl text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Add Doctor
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 p-2 lg:w-full border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 p-2 lg:w-full border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 p-2 lg:w-full border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 dark:text-gray-300"
          >
            Image
          </label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="profileImage/*"
            onChange={handleImageUpload}
            className="mt-1 p-2 lg:w-full w-[220px] border rounded-lg"
          />
          {loading && <p className="text-gray-500 mt-2">Uploading image...</p>}
        </div>

        <div className="lg:flex gap-10">
          <div className="mb-4 flex-1">
            <label
              htmlFor="speciality"
              className="block text-gray-700 dark:text-gray-300"
            >
              Specialty
            </label>
            <input
              type="text"
              id="speciality"
              name="speciality"
              value={formData.speciality}
              onChange={handleInputChange}
              className="mt-1 p-2 lg:w-full border rounded-lg"
              required
            />
          </div>

          <div className="mb-4 flex-1">
            <label
              htmlFor="degree"
              className="block text-gray-700 dark:text-gray-300"
            >
              Degree
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
              className="mt-1 p-2 lg:w-full border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="lg:flex gap-10">
          <div className="mb-4 flex-1">
            <label
              htmlFor="experience"
              className="block text-gray-700 dark:text-gray-300"
            >
              Experience
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="mt-1 p-2 lg:w-full border rounded-lg"
              required
            />
          </div>

          <div className="mb-4 flex-1">
            <label
              htmlFor="fees"
              className="block text-gray-700 dark:text-gray-300"
            >
              Fees
            </label>
            <input
              type="number"
              id="fees"
              name="fees"
              value={formData.fees}
              onChange={handleInputChange}
              className="mt-1 p-2 lg:w-full border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="lg:flex gap-10">
          <div className="mb-4 flex-1">
            <label
              htmlFor="experience"
              className="block text-gray-700 dark:text-gray-300"
            >
              District
            </label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="mt-1 p-2 lg:w-full border rounded-lg"
              required
            />
          </div>

          <div className="mb-4 flex-1">
            <label
              htmlFor="fees"
              className="block text-gray-700 dark:text-gray-300"
            >
              Upazila
            </label>
            <input
              type="text"
              id="upazila"
              name="upazila"
              value={formData.upazila}
              onChange={handleInputChange}
              className="mt-1 p-2 lg:w-full border rounded-lg"
              required
            />
          </div>
        </div>
        <div className="lg:flex gap-10">
          <div className="mb-4 flex-1">
            <label
              htmlFor="address"
              className="block text-gray-700 dark:text-gray-300"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 p-2 lg:w-full border rounded-lg"
              required
            />
          </div>
          <div className="mb-4 flex-1">
            <label
              htmlFor="address"
              className="block text-gray-700 dark:text-gray-300"
            >
              Chamber
            </label>
            <input
              type="text"
              id="chamber"
              name="chamber"
              value={formData.chamber}
              onChange={handleInputChange}
              className="mt-1 p-2 lg:w-full border rounded-lg"
              required
            />
          </div>
        </div>

        <h3>Available Slots</h3>
        <div className="mb-4 gap-4 lg:flex">
          <label
            htmlFor="address"
            className="block text-gray-700 dark:text-gray-300"
          >
            Date :
          </label>
          <input
            type="date"
            name="slotDate"
            value={slot.slotDate}
            onChange={handleSlotChange}
            className="border p-1 rounded-md"
          />
          <label
            htmlFor="address"
            className="block text-gray-700 dark:text-gray-300"
          >
            Time :
          </label>
          <input
            type="time"
            name="slotTime"
            value={slot.slotTime}
            onChange={handleSlotChange}
            className="border p-1 rounded-md"
          />
          <button type="button" onClick={handleAddSlot}>
            Add Slot
          </button>
        </div>
        <ul>
          {formData.availableSlots?.map((s, index) => (
            <li key={index}>
              {s.slotDate} - {s.slotTime}
            </li>
          ))}
        </ul>

        <button
          type="submit"
          className="btn btn-square lg:w-full w-[220px] p-4 hover:text-white bg-[#47ccc8] rounded-lg shadow-lg flex items-center justify-center hover:bg-blue-950"
          disabled={loading}
        >
          {loading ? (
            <>
              <ClipLoader loading={loading} size={20} />
              <span className="ml-2 text-black">Adding...</span>
            </>
          ) : (
            "Add Doctor"
          )}
        </button>
      </form>
    </div>
  );
}
