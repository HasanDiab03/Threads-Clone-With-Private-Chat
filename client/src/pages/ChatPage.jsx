import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useCustomToast from "../hooks/useCustomToast";
import {
  getConversations,
  searchConversation,
} from "../requests/messageRequests";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  setSelectedConversation,
} from "../reducers/messagesSlice";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const toast = useCustomToast();
  const { conversations } = useSelector((state) => state.message);
  const { selectedConversation } = useSelector((state) => state.message);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const { socket, onlineUsers } = useSocket();

  const handleGetConversations = async () => {
    try {
      await dispatch(getConversations()).unwrap();
    } catch (error) {
      toast("Error", error, "error");
    }
    setLoadingConversations(false);
  };

  useEffect(() => {
    handleGetConversations();
  }, []);

  const ConversationSearchHandler = async (e) => {
    e.preventDefault();
    setLoadingSearch(true);
    const searchedUser = await searchConversation(searchText, toast);
    if (searchedUser) {
      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        toast("Error", "You cannot message yourself", "error");
      }

      const existingConversation = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (existingConversation) {
        dispatch(
          setSelectedConversation({
            _id: existingConversation._id,
            userId: searchedUser._id,
            username: searchedUser.username,
            userProfilePic: searchedUser.profilePic,
          })
        );
      }
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      dispatch(addConversation(mockConversation));
    }
    setLoadingSearch(false);
    setSearchText("");
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      width={{
        lg: "750px",
        md: "80%",
        base: "100%",
      }}
      padding={"4"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={"700"}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>
          <from onSubmit={ConversationSearchHandler}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={ConversationSearchHandler}
                isLoading={loadingSearch}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </from>
          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, index) => (
              <Flex
                key={index}
                gap={4}
                alignItems={"center"}
                padding={1}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton height={"10px"} width={"80px"} />
                  <Skeleton height={"8px"} width={"90%"} />
                </Flex>
              </Flex>
            ))}
          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
              />
            ))}
        </Flex>
        {!selectedConversation._id ? (
          <Flex
            flex={70}
            borderRadius={"md"}
            padding={2}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        ) : (
          <MessageContainer />
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;
