import { Button } from "@chakra-ui/react";
import { FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
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
