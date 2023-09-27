import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import userReducer from "./reducers/userSlice";
import postReducer from "./reducers/postSlice";
import messageReducer from "./reducers/messagesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    message: messageReducer,
  },
});
