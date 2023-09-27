import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const url = "/api/messages";
const token = JSON.parse(localStorage.getItem("token"));

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const getConversations = createAsyncThunk(
  "messages/getConversations",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${url}/conversations`, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getMessages = async (recepientId, toast) => {
  try {
    const { data } = await axios.get(`${url}/${recepientId}`, config);
    return data;
  } catch (error) {
    toast("Error", error.response.data.message, "error");
  }
};

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ recipientId, message }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${url}`,
        { recipientId, message },
        config
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const searchConversation = async (username, toast) => {
  try {
    const { data } = await axios.get(
      `/api/users/profile/${username}`,
      config
    );
    return data;
  } catch (error) {
    toast("Error", error.response.data.message, "error");
  }
};
