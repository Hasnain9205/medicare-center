import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../components/provider/AuthProvider"; // Adjust the import path as necessary

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
