import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { sendMessage } from "../requests/messageRequests";
import { useSelector, useDispatch } from "react-redux";
import useCustomToast from "../hooks/useCustomToast";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const { selectedConversation } = useSelector((state) => state.message);
  const currentUser = useSelector((state) => state.user);
  const toast = useCustomToast();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!messageText) return;
    try {
      await dispatch(
        sendMessage({
          message: messageText,
          recipientId: selectedConversation.userId,
        })
      ).unwrap();
      setMessages((messages) => [
        ...messages,
        {
          text: messageText,
          sender: currentUser._id,
        },
      ]);
    } catch (error) {
      toast("Error", error, "error");
    }
    setMessageText("");
  };

  return (
    <form onSubmit={submitHandler}>
      <InputGroup>
        <Input
          width={"full"}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
        />
        <InputRightElement>
          <IoSendSharp cursor={"pointer"} onClick={submitHandler} />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
