import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.Auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !window.localStorage.getItem("user") &&
      (user === null || token === null)
    ) {
      toast.dismiss();
      navigate("/sign-in");
    }
  });
  if (user !== null) {
    return children;
  }
};

export default PrivateRoute;
