import { createSlice } from "@reduxjs/toolkit";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../requests/messageRequests";

const initialState = {
  conversations: [],
  selectedConversation: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      return { ...state, selectedConversation: action.payload };
    },
    addConversation: (state, action) => {
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
      };
    },
    updateConversation: (state, action) => {
      return {
        ...state,
        conversations: state.conversations.map((conv) => {
          if (conv._id === action.payload.conversationId) {
            return {
              ...conv,
              lastMessage: {
                text: action.payload.text,
                sender: action.payload.sender,
              },
            };
          }
          return conv;
        }),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.fulfilled, (state, action) => {
        return { ...state, conversations: action.payload };
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        return {
          ...state,
          conversations: state.conversations.map((conv) =>
            conv._id === state.selectedConversation._id
              ? {
                  ...conv,
                  lastMessage: {
                    text: action.payload.text,
                    sender: action.payload.sender,
                  },
                }
              : conv
          ),
        };
      });
  },
});

export const { setSelectedConversation, addConversation, updateConversation } =
  messageSlice.actions;

export default messageSlice.reducer;
