import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  signup,
  updateProfile,
} from "../requests/userRequests";

const initialState = JSON.parse(localStorage.getItem("user"));

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", JSON.stringify(action.payload.token));
        return action.payload.user;
      })
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", JSON.stringify(action.payload.token));
        return action.payload.user;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        localStorage.setItem("user", JSON.stringify(action.payload));
        return action.payload;
      })
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
