import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deletePost,
  getFeedPosts,
  getPost,
  getUserPosts,
  likeAndUnlike,
  replyToPost,
} from "../requests/postRequests";
const initialState = { posts: [], post: null };

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        return { ...state, posts: [action.payload, ...state.posts] };
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        return { ...state, posts: action.payload };
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        return {
          ...state,
          posts: state.posts.filter((post) => post._id !== action.payload),
        };
      })
      .addCase(replyToPost.fulfilled, (state, action) => {
        return {
          ...state,
          posts: state.posts.map((post) =>
            post._id === action.payload._id ? action.payload : post
          ),
          post: action.payload,
        };
      })
      .addCase(getPost.fulfilled, (state, action) => {
        return { ...state, post: action.payload };
      })
      .addCase(likeAndUnlike.fulfilled, (state, action) => {
        return {
          ...state,
          posts: state.posts.map((post) =>
            post._id === action.payload._id ? action.payload : post
          ),
          post: action.payload,
        };
      })
      .addCase(getFeedPosts.fulfilled, (state, action) => {
        return { ...state, posts: action.payload };
      });
  },
});

export default postSlice.reducer;
