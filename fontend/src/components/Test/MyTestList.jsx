import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MyTestList() {
  const [selectedTests, setSelectedTests] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const tests = JSON.parse(localStorage.getItem("selectedTests")) || [];
    setSelectedTests(tests);

    // Calculate total price
    const price = tests.reduce((acc, test) => acc + parseFloat(test.price), 0);
    setTotalPrice(price);
  }, []);

  const handlePayment = () => {
    if (selectedTests.length === 0) {
      alert("No tests selected. Please select tests to proceed.");
    } else {
      // Redirect to payment page (or handle payment logic)
      alert("Proceeding to payment...");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-teal-700 mb-6">Selected Tests</h2>

      {selectedTests.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ul>
            {selectedTests.map((test, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-4 border-b"
              >
                <div className="flex items-center">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-12 h-12 object-cover rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-lg text-teal-800">
                      {test.name}
                    </p>
                    <p className="text-gray-600">{test.category}</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-teal-600">
                  {test.price} Taka
                </p>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-semibold text-gray-800">Total Price:</p>
            <p className="text-xl font-bold text-teal-700">{totalPrice} Taka</p>
          </div>

          <button
            onClick={handlePayment}
            className="mt-8 w-full bg-teal-600 text-white hover:bg-teal-700 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      ) : (
        <p className="text-gray-500">
          No tests selected yet. Please add tests to your list.
        </p>
      )}

      {/* Optional: Redirect to add tests page */}
      <Link to="/" className="block text-center mt-4 text-teal-600">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md">
          Go Back to Home
        </button>
      </Link>
    </div>
  );
}
