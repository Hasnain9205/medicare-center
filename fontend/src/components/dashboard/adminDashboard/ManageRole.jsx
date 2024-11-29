import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";

const ManageRole = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getAccessToken();
      try {
        const response = await useAxios.get("/users/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch users!",
        });
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId) => {
    const token = getAccessToken();
    if (!selectedRole) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Role",
        text: "Please select a role before updating.",
      });
      return;
    }

    try {
      await useAxios.put(
        `/users/user-role/${userId}`,
        { role: selectedRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Role Updated",
        text: "User role has been updated successfully!",
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: selectedRole } : user
        )
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the role.",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Manage All Users Role
      </h1>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <img
                      src={user.profileImage}
                      alt={`${user.name}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      className="border rounded-md px-2 py-1"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                      <option value="diagnostic">Diagnostic</option>
                    </select>
                    <button
                      onClick={() => handleRoleChange(user._id)}
                      className="ml-2 bg-[#47ccc8] hover:text-white font-bold px-4 py-2 rounded-md hover:bg-blue-950"
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageRole;
