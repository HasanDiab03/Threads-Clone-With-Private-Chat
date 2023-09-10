import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connect;
