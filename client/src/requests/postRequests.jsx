import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// const url = "https://threads-clone-hd.onrender.com/api/posts";
const url = "https://threads-dv7o.onrender.com/api/posts";

const token = JSON.parse(localStorage.getItem("token"));

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const createPost = createAsyncThunk(
  "post/creat",
  async (details, thunkAPI) => {
    try {
      const { data } = await axios.post(`${url}/create`, details, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const getPost = createAsyncThunk(
  "post/getPost",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`${url}/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserPosts = createAsyncThunk(
  "post/getPosts",
  async (username, thunkAPI) => {
    try {
      const { data } = await axios.get(`${url}/user/${username}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${url}/${id}`, config);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const replyToPost = createAsyncThunk(
  "post/reply",
  async ({ reply, id }, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `${url}/reply/${id}`,
        { text: reply },
        config
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const likeAndUnlike = createAsyncThunk(
  "post/like",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.patch(`${url}/like/${id}`, {}, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getFeedPosts = createAsyncThunk(
  "posts/getFeedPosts",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${url}/feed`, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
