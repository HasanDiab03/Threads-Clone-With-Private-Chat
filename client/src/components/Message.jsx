import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const Message = ({ ownMessage, message }) => {
  const { selectedConversation } = useSelector((state) => state.message);
  const currentUser = useSelector((state) => state.user);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
            {message.text}
          </Text>
          <Avatar
            size={""}
            width={"7"}
            height={"7"}
            src={currentUser.profilePic}
          />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar
            size={""}
            width={"7"}
            height={"7"}
            src={selectedConversation.userProfilePic}
          />
          <Text
            maxW={"350px"}
            bg={"gray.400"}
            p={1}
            borderRadius={"md"}
            color={"black"}
          >
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
