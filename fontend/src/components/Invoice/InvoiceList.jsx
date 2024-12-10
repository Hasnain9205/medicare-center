import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../Hook/useAxios"; // Make sure this is a valid custom hook or Axios instance
import { useParams } from "react-router-dom";

const InvoiceList = () => {
  const { appointmentId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch invoice details
  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/tests/invoice/${appointmentId}`
      );
      console.log("Invoice fetched: ", response.data);
      setInvoice(response.data.appointment);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to fetch invoice.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Download invoice
  const downloadInvoice = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/tests/download-invoice/${appointmentId}`,
        { responseType: "blob" } // Necessary for file download
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();

      Swal.fire({
        icon: "success",
        title: "Downloaded",
        text: "Invoice downloaded successfully!",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to download invoice.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      fetchInvoice();
    }
  }, [appointmentId]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Invoice Details</h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : invoice ? (
          <div>
            <p className="text-lg mb-2">
              <strong>User:</strong> {invoice.userId.name}{" "}
              {invoice.userId.lastName}
            </p>
            <p className="text-lg mb-2">
              <strong>Appointment Date:</strong> {invoice.appointmentDate}
            </p>
            <p className="text-lg mb-2">
              <strong>Total Amount:</strong> ${invoice.price}
            </p>
            <p className="text-lg mb-2">
              <strong>Payment Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  invoice.paymentStatus === "paid"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {invoice.paymentStatus}
              </span>
            </p>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Test Details</h2>
              <ul className="list-disc list-inside space-y-2">
                {invoice.testDetails?.map((test, index) => (
                  <li key={index} className="text-gray-700">
                    {test.testName} -{" "}
                    <span className="font-semibold">${test.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={downloadInvoice}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download Invoice
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No invoice available.</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
