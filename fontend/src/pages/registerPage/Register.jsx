import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../../src/assets/r.png";
import axios from "../../Hook/useAxios";
import Swal from "sweetalert2";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const profileImage = form.profileImage.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImage) formData.append("profileImage", profileImage);
    setLoading(true);

    try {
      const { status } = await axios.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registration successful",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Error occurred during registration:",
        error.response?.data
      );
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Registration failed",
        text:
          error.response?.data?.msg || "An error occurred. Please try again.",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero mt-32">
        <div className="hero-content flex border-2 shrink-0 shadow-2xl">
          <div>
            <img className="w-[700px]" src={loginImg} alt="register" />
          </div>
          <div className="card bg-base-100 w-full max-w-xl shrink-0 shadow-2xl ">
            <form onSubmit={handleRegister} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Image</span>
                </label>
                <input
                  type="file"
                  name="profileImage"
                  className="file-input file-input-bordered"
                  accept="image/*"
                />
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn hover:bg-blue-950 hover:text-white bg-[#47ccc8] font-bold ${
                    loading ? "loading" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
                <h1 className="text-center mt-2">
                  Have an account?
                  <Link to="/login">
                    <span className="text-blue-600"> Login</span>
                  </Link>
                </h1>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
