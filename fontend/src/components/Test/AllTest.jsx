import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { Link } from "react-router-dom";

export default function AllTest() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const TestData = async () => {
      try {
        const data = await useAxios.get("/tests/get-all-test");
        setTests(data.data.tests);
        console.log("test all", data.data);
      } catch (error) {
        console.log("get doctor error", error);
      }
    };
    TestData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <h1 className="flex flex-col justify-center items-center rounded-md text-3xl font-bold">
        All Test Services
      </h1>
      <p className="text-center text-gray-700 mb-8 mt-2">
        Access a range of blood tests to ensure your health and well-being. Our
        team is dedicated to providing timely, accurate results.
      </p>

      <section className="mt-16 flex flex-wrap gap-6 justify-center">
        {tests.slice(0, 9).map((test) => (
          <div
            key={test._id}
            className="card card-compact p-6 bg-base-100 w-96 shadow-xl cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
          >
            <img
              className="w-full h-48 object-cover"
              src={test.image}
              alt="Test Image"
            />
            <h2 className="text-2xl font-bold mb-2 mt-4">{test.name}</h2>
            <p className="text-gray-600 mb-4">{test.description}</p>
            <div className="flex mb-4 items-center justify-between rounded-full pt-3 px-6 bg-teal-200">
              <p className="text-green-600 mb-4">Price: {test.price}</p>
              <p className="text-green-600 mb-4">Category: {test.category}</p>
            </div>
            <Link
              to={`/testDetails/${test._id}`}
              className="bg-blue-900 text-white hover:bg-[#47ccc8] hover:text-blue-950 transition duration-200 font-semibold px-6 py-3 rounded-full flex items-center justify-center gap-2 mx-auto"
            >
              Test Details <FaArrowRight />
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
