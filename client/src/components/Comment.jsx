import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";

const Comment = ({ reply }) => {
  return (
    <>
      <Flex gap={4} py={2} my={2} width={"full"}>
        <Avatar src={reply.userId.profilePic} size={"sm"} />
        <Flex gap={1} width={"full"} flexDirection={"column"}>
          <Flex
            width={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply.userId.username}
            </Text>
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
