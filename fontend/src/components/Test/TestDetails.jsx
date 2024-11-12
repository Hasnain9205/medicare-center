import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";

export default function TestDetails() {
  const [test, setTest] = useState(null);
  const { testId } = useParams();

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const token = getAccessToken();
        const response = await useAxios.get(`/tests/test-by-id/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTest(response.data.test);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    fetchTestDetails();
  }, [testId]);

  // Handle adding the test to the selected list
  const handleSelectTest = () => {
    if (test) {
      let selectedTests =
        JSON.parse(localStorage.getItem("selectedTests")) || [];
      selectedTests.push(test);
      localStorage.setItem("selectedTests", JSON.stringify(selectedTests));
      alert(`${test.name} has been added to your selected tests.`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      {test ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{test.name}</h1>
          <img
            src={test.image}
            alt={test.name}
            className="w-96 h-48 object-cover mb-4"
          />
          <p className="text-lg text-gray-600 mb-4">{test.description}</p>
          <p className="text-xl font-semibold text-green-600 mb-4">
            Price: {test.price}
          </p>
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Category: {test.category}
          </p>
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Test Duration: {test.duration} mins
          </p>
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Available Slots: {test.availableSlots} slots
          </p>

          {/* Additional Test Details */}
          {test.instructions && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Instructions:</h3>
              <p className="text-gray-700">{test.instructions}</p>
            </div>
          )}

          <button
            onClick={handleSelectTest}
            className="bg-blue-900 text-white hover:bg-[#47ccc8] hover:text-blue-950 transition duration-200 font-semibold px-6 py-3 rounded-full flex items-center justify-center gap-2 mx-auto"
          >
            Book Test
          </button>
        </>
      ) : (
        <p>Loading test details...</p>
      )}
    </div>
  );
}
