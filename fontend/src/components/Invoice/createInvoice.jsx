import { useState } from "react";
import useAxios from "../../Hook/useAxios";

const CreateInvoice = () => {
  const [userId, setUserId] = useState("");
  const [testIds, setTestIds] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before submitting
    if (!userId || !testIds.length || !dueDate) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      const response = await useAxios.post("/invoice/create-invoice", {
        userId,
        testIds,
        dueDate,
      });
      setMessage(`Invoice Created! ID: ${response.data.invoice._id}`);
    } catch (error) {
      setMessage(
        "Error creating invoice: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  return (
    <div>
      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Test IDs (comma separated)"
          value={testIds.join(",")} // Show as a comma-separated list in input
          onChange={(e) =>
            setTestIds(e.target.value.split(",").map((id) => id.trim()))
          } // Trim whitespace
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Create Invoice</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateInvoice;
