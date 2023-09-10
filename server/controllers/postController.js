import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
  try {
    const { postedBy, text, imgUrl } = req.body;
    if (!postedBy || !text)
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    const user = await User.findById(postedBy);
    if (!user) return res.status(400).json({ message: "User doesn't exist" });
    if (postedBy !== req.user._id.toString())
      return res
        .status(401)
        .json({ message: "You cannot create posts for other users" });
    const maxLength = 500;
    if (text.length > maxLength)
      return res
        .status(400)
        .json({ message: `Text Cannot exceed ${maxLength} characters` });
    let post = await Post.create({ ...req.body, img: imgUrl });
    post = await post.populate("postedBy", "username profilePic name");
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error creating a post", error.message);
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("replies.userId", "username profilePic")
      .populate("postedBy", "profilePic username name");
    if (!post) return res.status(404).json({ message: "Post doesn't exist" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error getting a post", error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post)
      return res
        .status(400)
        .json({ message: "cannot delete post that doesn't exist" });
    if (!post.postedBy.equals(req.user._id))
      return res
        .status(401)
        .json({ message: "Cannot delete a post that is not yours" });
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post Deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error deleting a post", error.message);
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post)
      return res
        .status(400)
        .json({ message: "Cannot like a post that doesn't exist" });
    const userLiked = post.likes.includes(req.user._id);
    if (userLiked) {
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      )
        .populate("replies.userId", "username profilePic")
        .populate("postedBy", "profilePic username name");
      res.status(200).json(updatedPost);
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      )
        .populate("replies.userId", "username profilePic")
        .populate("postedBy", "profilePic username name");
      res.status(200).json(updatedPost);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error liking a post", error.message);
  }
};

export const replyToPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    if (!text) return res.status(400).json({ message: "Text is required" });
    const reply = { userId, text };
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $push: { replies: reply },
      },
      { new: true }
    )
      .populate("replies.userId", "username profilePic")
      .populate("postedBy", "profilePic username name");
    if (!post)
      return res
        .status(400)
        .json({ message: "Cannot reply to a post that doesn't exist" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error relying to a post", error.message);
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const user = req.user;
    const following = user.following;
    const FeedPosts = await Post.find({ postedBy: { $in: following } })
      .populate("replies.userId", "username profilePic")
      .populate("postedBy", "profilePic username")
      .sort("-createdAt");
    res.status(200).json(FeedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error getting feed post", error.message);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const posts = await Post.find({ postedBy: user._id })
      .populate("replies.userId", "username profilePic")
      .populate("postedBy", "profilePic username")
      .sort("-createdAt");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error getting user posts", error.message);
  }
};
