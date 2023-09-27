import { Button } from "@chakra-ui/react";
import { FiLogIn } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removePosts } from "../reducers/postSlice";

const LoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(removePosts());
    navigate("/auth");
  };
  
  if (window.location.href.includes("/auth")) {
    return null;
  }

  return (
    <Button
      size={"xs"}
      onClick={handleLogin}
    >
      <FiLogIn size={18} />
    </Button>
  );
};

export default LoginButton;
