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

  const handleSelectTest = () => {
    if (test) {
      let selectedTests =
        JSON.parse(localStorage.getItem("selectedTests")) || [];
      if (selectedTests.some((selectedTest) => selectedTest._id === test._id)) {
        alert(`${test.name} is already selected.`);
        return;
      }
      selectedTests.push(test);
      localStorage.setItem("selectedTests", JSON.stringify(selectedTests));
      alert(`${test.name} has been added to your selected tests.`);
    }
  };

  const selectedTests = JSON.parse(localStorage.getItem("selectedTests")) || [];
  const isTestSelected = selectedTests.some(
    (selectedTest) => selectedTest._id === testId
  );

  return (
    <div className="items-center mt-20 container mx-auto">
      {test ? (
        <>
          <div className="flex flex-col md:flex-row gap-10 bg-white shadow-md rounded-lg p-8 transition-all duration-200 transform hover:shadow-lg hover:scale-105">
            <div className="md:w-1/3">
              <img
                src={test.image}
                alt={test.name}
                className="w-full h-64 object-cover rounded-md shadow-md"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                {test.name}
              </h1>
              <p className="text-gray-700 text-lg mb-4">{test.description}</p>
              <p className="text-lg font-medium text-teal-700 mb-4">
                Category: <span className="font-semibold">{test.category}</span>
              </p>
              <p className="text-2xl font-semibold text-green-600 mb-10">
                Price: {test.price} Taka
              </p>

              <button
                onClick={handleSelectTest}
                disabled={isTestSelected}
                className={`${
                  isTestSelected
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-blue-900 hover:text-teal-100"
                } text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200`}
              >
                {isTestSelected ? "Test Already Selected" : "Book Test"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Loading test details...</p>
      )}
    </div>
  );
}
