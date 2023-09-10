import { createSlice } from "@reduxjs/toolkit";

const initialState = "login";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (_, action) => {
      return action.payload;
    },
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
