import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { startTransition, useEffect, useRef, useState } from "react";
import useCustomToast from "../hooks/useCustomToast";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../requests/messageRequests";
import { useSocket } from "../context/SocketContext";
import { updateConversation } from "../reducers/messagesSlice";

const MessageContainer = () => {
  const toast = useCustomToast();
  const { selectedConversation } = useSelector((state) => state.message);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
      dispatch(updateConversation(message));
    });
    return () => socket.off("newMessage");
  }, []);

  useEffect(() => {
    const handleGetMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      if (selectedConversation.mock) {
        setLoadingMessages(false);
        return;
      }
      const data = await getMessages(selectedConversation.userId, toast);
      if (data) {
        setMessages(data);
      }
      setLoadingMessages(false);
    };
    handleGetMessages();
  }, [selectedConversation]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message Header  */}
      <Flex width={"full"} height={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}{" "}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />
      <Flex
        flexDirection={"column"}
        gap={4}
        my={4}
        height={"400px"}
        overflowY={"auto"}
        p={2}
      >
        {loadingMessages &&
          [...Array(5)].map((_, index) => (
            <Flex
              key={index}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={index % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {index % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDirection={"column"} gap={2}>
                <Skeleton height={"8px"} width={"250px"} />
                <Skeleton height={"8px"} width={"250px"} />
                <Skeleton height={"8px"} width={"250px"} />
              </Flex>
              {index % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}
        {!loadingMessages &&
          messages.map((message) => (
            <Flex
              key={message._id}
              flexDirection={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? lastMessageRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={
                  message.sender.toString() === currentUser?._id?.toString()
                }
              />
            </Flex>
          ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
