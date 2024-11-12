import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../../src/assets/r.png";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../components/provider/AuthProvider";

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const userRole = await login(email, password);
      Swal.fire({
        position: "center",
        icon: "success",
        title: `${userRole} login successfully`,
        showConfirmButton: false,
        timer: 2000,
      });
      if (userRole === "admin") {
        navigate("/adminDashboard");
      } else if (userRole === "doctor") {
        navigate("/doctorDashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Login failed",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div>
      <div className="hero mt-32">
        <div className="hero-content flex border-2 shrink-0 shadow-2xl">
          <div>
            <img className="w-[700px]" src={loginImg} alt="" />
          </div>
          <div className="card bg-base-100 w-full max-w-xl shrink-0 shadow-2xl">
            <form onSubmit={handleLogin} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
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
                  placeholder="password"
                  className="input input-bordered"
                  required
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
                  {loading ? "Logging in..." : "Login"}{" "}
                </button>
                <h1 className="text-center mt-2">
                  Don't have an account?
                  <Link to="/register">
                    <span className="text-blue-600"> Register</span>
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
