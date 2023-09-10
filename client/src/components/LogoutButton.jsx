import { Button } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { logout } from "../reducers/userSlice";
import useCustomToast from "../hooks/useCustomToast";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Button
      size={"xs"}
      onClick={handleLogout}
    >
      <FiLogOut size={18} />
    </Button>
  );
};

export default LogoutButton;
