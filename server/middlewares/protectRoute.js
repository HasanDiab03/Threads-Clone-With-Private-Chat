import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const protectRoute = async (req, res, next) => {
  try {
    // const token = req.cookies.jwt;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized" });
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId).select("-password");
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in protect middleWare", error.message);
  }
};

export default protectRoute;
