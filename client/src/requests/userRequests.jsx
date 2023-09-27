import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const url = "https://threads-dv7o.onrender.com/api/users";
const token = JSON.parse(localStorage.getItem("token"));

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const signup = createAsyncThunk(
  "user/signup",
  async (inputs, thunkAPI) => {
    try {
      const { data } = await axios.post(`${url}/signup`, inputs);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (inputs, thunkAPI) => {
    try {
      const { data } = await axios.post(`${url}/login`, inputs);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
//   try {
//     const { data } = await axios.post(`${url}/logout`);
//     return data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response.data.message);
//   }
// });

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ user, inputs, imgUrl }, thunkAPI) => {
    try {
      const { data } = await axios.patch(
        `${url}/update/${user._id}`,
        {
          ...inputs,
          profilePic: imgUrl,
        },
        config
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const followUnfollow = async (userId, toast) => {
  try {
    await axios.patch(`${url}/follow/${userId}`, {}, config);
    return true;
  } catch (error) {
    toast("Error", error.response.data.message, "error");
  }
};

export const getSearchedUsers = async (search, toast) => {
  try {
    const { data } = await axios.get(`${url}/search?search=${search}`);
    return data;
  } catch (error) {
    toast("Error", error.response.data.message, "error");
  }
};

export const getUserProfile = async (username, toast) => {
  try {
    const { data } = await axios.get(`${url}/profile/${username}`);
    return data;
  } catch (error) {
    toast("Error", error.response.data.message, "error");
  }
};
