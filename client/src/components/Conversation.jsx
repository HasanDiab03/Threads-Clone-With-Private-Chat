import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "../reducers/messagesSlice";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const currentUser = useSelector((state) => state.user);
  const { selectedConversation } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      padding={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() =>
        dispatch(
          setSelectedConversation({
            _id: conversation._id,
            userId: user._id,
            userProfilePic: user.profilePic,
            username: user.username,
            mock: conversation.mock,
          })
        )
      }
      bg={
        selectedConversation?._id === conversation?._id
          ? colorMode == "light"
            ? "gray.400"
            : "gray.700"
          : ""
      }
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user.profilePic}
        >
          {isOnline && <AvatarBadge boxSize={"1em"} bg={"green.500"} />}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user.username}
          <Image src="/verified.png" width={4} height={4} marginLeft={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser._id === lastMessage.sender && <BsCheck2All />}
          {lastMessage.text.length > 18
            ? lastMessage.text.substring(0, 18) + "..."
            : lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
