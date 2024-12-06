import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../Utils";
import axiosInstance from "../../Hook/useAxios";

const MyTestInvoices = () => {
  const [invoice, setInvoice] = useState(null);

  const fetchInvoice = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "User ID not found in local storage.",
          confirmButtonText: "OK",
        });
        return;
      }

      const token = getAccessToken();
      const response = await axiosInstance.get(
        `/invoice/get-invoice/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.msg === "No invoices found for this user") {
        Swal.fire({
          icon: "error",
          title: "No Invoices Found",
          text: "You do not have any invoices available.",
          confirmButtonText: "OK",
        });
      } else {
        setInvoice(response.data.invoice);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Could not retrieve invoice.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDownloadPDF = async (invoiceData) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = getAccessToken();
      const response = await axiosInstance.get(
        `/invoice/download-pdf/${userId}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fileURL = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `invoice_${invoiceData._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Download Started!",
        text: "Your invoice PDF is being downloaded.",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Download Failed!",
        text: "Failed to download the invoice PDF.",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105">
      <h2 className="text-3xl font-extrabold text-center text-white mb-6 animate__animated animate__fadeIn">
        Invoice Details
      </h2>

      {invoice ? (
        <div className="bg-white p-6 rounded-lg shadow-xl animate__animated animate__fadeInUp">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xl font-semibold text-gray-800">
              <p className="text-lg">
                User:{" "}
                <span className="font-medium text-gray-600">
                  {invoice.user.name}
                </span>
              </p>
              <p className="text-lg">
                Email:{" "}
                <span className="font-medium text-gray-600">
                  {invoice.user.email}
                </span>
              </p>
            </div>

            <p className="mt-4 text-lg text-gray-800 font-semibold">
              Total Price:{" "}
              <span className="text-xl font-bold text-purple-700">
                ${invoice.totalPrice}
              </span>
            </p>

            <h3 className="mt-6 text-lg font-semibold text-gray-700">
              Test Details
            </h3>
            <ul className="space-y-4">
              {invoice.tests.map((test, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <p>
                    <strong>Test:</strong> {test.testName}
                  </p>
                  <p>
                    <strong>Category:</strong> {test.testCategory}
                  </p>
                  <p>
                    <strong>Price:</strong> ${test.price}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => handleDownloadPDF(invoice)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-md text-lg font-semibold transition-transform duration-300 hover:scale-105"
            >
              Download PDF
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-white text-xl">Loading...</p>
      )}
    </div>
  );
};
export default MyTestInvoices;
