import { Route, Routes } from "react-router-dom";
import Home from "./pages/homePage/Home";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/loginPage/Login";
import About from "./pages/aboutPage/About";
import Contact from "./pages/contactPage/Contact";
import DocAppointment from "./pages/appointments/DocAppointment";
import Register from "./pages/registerPage/Register";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import MyProfile from "./pages/myProfilePage/MyProfile";
import Dashboard from "./components/dashboard/Dashboard";
import AddDoctor from "./components/dashboard/adminDashboard/AddDoctor";
import AllDoctor from "./components/dashboard/adminDashboard/AllDoctor";
import Footer from "./pages/Footer/Footer";
import MyAppointments from "./pages/myProfilePage/MyAppointments";
import MyAppointment from "./pages/appointments/MyAppointment";
import TestDetails from "./components/Test/TestDetails";
import NotFound from "./components/notFound/NotFound";
import Doctors from "./components/departments/Doctors";
import Appointments from "./components/topDoctors/Appointments";
import MyTestList from "./components/Test/MyTestList";
import AdminDashboard from "./components/dashboard/adminDashboard/AdminDashboard";
import { AddTest } from "./components/dashboard/adminDashboard/AddTest";
import AdminGetAllTest from "./components/dashboard/adminDashboard/AdminGetAllTest";

function App() {
  return (
    <div>
      <div className="mx-4 sm:mx-[10%]">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/myAppointments" element={<MyAppointments />} />
          <Route path="/appointments/:doctorId" element={<Appointments />} />
          <Route path="/testDetails/:testId" element={<TestDetails />} />
          <Route path="/myTestsList" element={<MyTestList />} />

          {/* Protected routes for dashboard */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="adminDashboard" element={<AdminDashboard />} />
            <Route path="addDoctor" element={<AddDoctor />} />
            <Route path="allDoctor" element={<AllDoctor />} />
            <Route path="addTest" element={<AddTest />} />
            <Route path="adminGetAllTest" element={<AdminGetAllTest />} />
          </Route>

          <Route path="/myAppointment" element={<MyAppointment />} />
          <Route
            path="/appointments/:docId"
            element={
              <PrivateRoute>
                <DocAppointment />
              </PrivateRoute>
            }
          />

          {/* Fallback Route for unknown URLs */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
