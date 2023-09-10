import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "name, username, email, and password are all required",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
      username,
    });
    const token = user.generateTokenAndSetCookie();
    // res.cookie("jwtCookie", token, {
    //   httpOnly: true, // more secure
    //   maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    //   sameSite: "strict",
    // });
    const sentUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    };
    res.status(201).json({
      user: sentUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in signup ", error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (!userExists) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const token = userExists.generateTokenAndSetCookie();
    // res.cookie("jwtCookie", token, {
    //   httpOnly: true, // more secure
    //   maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    //   sameSite: "strict",
    // });
    const user = {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      username: userExists.username,
      bio: userExists.bio,
      profilePic: userExists.profilePic,
    };
    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in login", error.message);
  }
};

// export const logoutUser = (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 1 });
//     res.status(200).json({ message: "User logged out" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//     console.log("Error in logout", error.message);
//   }
// };

export const followAndUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ message: "You cannot follow/unFollow yourself" });
    if (!userToModify)
      return res.status(400).json({ message: "User Not Found" });
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // pull operation
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "user unFollowed!" });
    } else {
      // push operation
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "user Followed!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in following/unFollowing", error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, username, password, bio, profilePic } = req.body;
    if (id !== req.user._id.toString())
      return res
        .status(401)
        .json({ message: "You cannot update other users' profile" });
    let user = await User.findById(req.user._id);
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user.password = hashed;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user = await User.findByIdAndUpdate(req.user._id, user, {
      new: true,
    }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in updating", error.message);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select(
      "-password -updatedAt"
    );
    if (!user) return res.status(404).json({ message: "User Not Found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getting user profile", error.message);
  }
};

export const getSearchedUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search)
      return res.status(400).json({ message: "Please provide search field" });
    const username = new RegExp(search, "i");
    const users = await User.find({
      $or: [{ name: username }, { username }],
    }).limit(5);
    return res.status(200).json(users);
  } catch (error) {}
};
