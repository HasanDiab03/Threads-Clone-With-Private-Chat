import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import useCustomToast from "../hooks/useCustomToast";
import { getSearchedUsers } from "../requests/userRequests";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const toast = useCustomToast();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!search) {
      toast("Error", "Please provide search input", "error");
      return;
    }
    setSearching(true);
    const data = await getSearchedUsers(search);
    if (data) {
      setUsers(data);
    }
    setSearching(false);
  };

  const handleClick = (user) => {
    onClose();
    setSearch("");
    setUsers([]);
    navigate(`/${user.username}`);
  };

  return (
    <>
      {user ? (
        <Flex justifyContent={"space-between"} mt={6} mb={12}>
          <Flex alignItems={"center"} gap={4}>
            <Link as={RouterLink} to={"/"}>
              <AiFillHome size={24} />
            </Link>
            <SearchIcon cursor={"pointer"} onClick={onOpen} />
          </Flex>
          <Image
            cursor={"pointer"}
            alt="logo"
            width={6}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
          />

          <Flex alignItems={"center"} gap={4}>
            <Link as={RouterLink} to={`/${user.username}`}>
              <RxAvatar size={24} />
            </Link>
            <LogoutButton />
          </Flex>
        </Flex>
      ) : (
        <Flex justifyContent={"center"} gap={5} mt={6} mb={12}>
          <Image
            cursor={"pointer"}
            alt="logo"
            width={6}
            src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
            onClick={toggleColorMode}
          />
          <LoginButton />
        </Flex>
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSearch("");
          setUsers([]);
        }}
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: 300, sm: 450 }}>
          <ModalHeader>Search Users</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex gap={2}>
              <FormControl>
                <Input
                  placeholder="Search users by name/username"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FormControl>
              <Button onClick={handleSearch}>Search</Button>
            </Flex>
            {searching && <Spinner size={"md"} mt={5} />}
            {!searching && users.length === 0 && (
              <h3 style={{ marginTop: "10px", textAlign: "center" }}>
                No Users Found
              </h3>
            )}
            {users.map((user) => (
              <Flex
                key={user._id}
                my={5}
                alignItems={"center"}
                gap={5}
                py={2}
                onClick={() => handleClick(user)}
                cursor={"pointer"}
              >
                <Avatar src={user.profilePic} size={{ base: "sm", sm: "md" }} />
                <Flex flexDirection={"column"}>
                  <Text fontSize={{ base: "md", sm: "xl" }} fontWeight={"bold"}>
                    {user.username}
                  </Text>
                  <Text fontSize={{ base: "xs", sm: "sm" }}>{user.name}</Text>
                </Flex>
              </Flex>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                onClose();
                setSearch("");
                setUsers([]);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Header;
