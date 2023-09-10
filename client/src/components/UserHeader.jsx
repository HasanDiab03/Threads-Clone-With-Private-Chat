import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import useCustomToast from "../hooks/useCustomToast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { followUnfollow } from "../requests/userRequests";

const UserHeader = ({ user }) => {
  const currentLoggedUser = useSelector((state) => state.user);
  const [following, setFollowing] = useState(
    user.followers.includes(currentLoggedUser?._id)
  );
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();

  const copyLink = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast("", "Profile Link Copied!", "success");
    });
  };

  const handleFollow = async () => {
    if (!currentLoggedUser) {
      toast("Error", "Please login to follow", "error");
      return;
    }
    if (loading) return;
    setLoading(true);
    const noError = await followUnfollow(user._id, toast);
    setLoading(false);
    if (noError) {
      if (following) {
        user.followers.pop();
        toast("Success", `${user.name} Unfollowed!`, "success");
      } else {
        user.followers.push(currentLoggedUser?._id);
        toast("Success", `${user.name} Followed!`, "success");
      }
      setFollowing(!following);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} width={"full"}>
        <Box>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight={"bold"} my={2}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic ? (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{ base: "lg", md: "xl" }}
            />
          ) : (
            <Avatar
              name={user.name}
              src={"https://bit.ly/broken-link"}
              size={{ base: "lg", md: "xl" }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentLoggedUser?._id === user._id && (
        <Link to={"/update"}>
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentLoggedUser?._id !== user._id && (
        <Button  onClick={handleFollow} size={"sm"} isLoading={loading}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex width={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"} fontSize={{ base: "sm", md: "md" }}>
            {user.followers.length} followers
          </Text>
          <Box
            width={0.5}
            height={0.5}
            bg={"gray.light"}
            borderRadius={"full"}
          ></Box>
          <Link color={"gray.light"} fontSize={{ base: "sm", md: "md" }}>
            instagram.com
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyLink}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex width={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
