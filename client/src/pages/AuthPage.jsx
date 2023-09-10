import { useSelector } from "react-redux";
import Login from "../components/Login";
import Signup from "../components/Signup";

const AuthPage = () => {
  const auth = useSelector((state) => state.auth);
  return <>{auth === "login" ? <Login /> : <Signup />}</>;
};

export default AuthPage;
