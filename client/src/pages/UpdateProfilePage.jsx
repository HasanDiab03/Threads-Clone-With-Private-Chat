import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePreviewImage from "../hooks/usePreviewImage";
import useCustomToast from "../hooks/useCustomToast";
import { updateProfile } from "../requests/userRequests";
import { useNavigate } from "react-router-dom";

const UpdateProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [inputs, setInputs] = useState({ ...user });
  const fileRef = useRef();
  const [handleImageChange, imgUrl, setImgUrl, imgName] = usePreviewImage();
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const [loading, setLoading] = useState();
  // const navigate = useNavigate();
  useEffect(() => {
    setImgUrl(user.profilePic);
  }, [user]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (loading) return;
      setLoading(true);
      await dispatch(updateProfile({ user, inputs, imgUrl })).unwrap();
      setLoading(false);
      toast("", "Profile Updated!", "success");
      // navigate(`/${user.username}`);
    } catch (error) {
      setLoading(false);
      toast("", error, "error");
    }
  };

  return (
    <Flex align={"center"} justify={"center"} my={6}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar
                size="xl"
                boxShadow={"md"}
                src={imgUrl || user.profilePic}
              />
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>
                Change Avatar
              </Button>
              <Input
                type="file"
                hidden
                onChange={(e) => handleImageChange(e, user)}
                ref={fileRef}
              />
            </Center>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input
            name="name"
            onChange={handleChange}
            value={inputs.name}
            placeholder="Full Name"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            onChange={handleChange}
            value={inputs.username}
            placeholder="UserName"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            name="email"
            onChange={handleChange}
            value={inputs.email}
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Input
            name="bio"
            onChange={handleChange}
            value={inputs.bio}
            placeholder="Your Bio"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            onChange={handleChange}
            placeholder="password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"green.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "green.500",
            }}
            isLoading={loading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default UpdateProfilePage;
