import Conversation from "../models/ConversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, recipientId } = req.body;
    const senderId = req.user._id;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      await newMessage.save(),
      Conversation.updateOne(
        { _id: conversation._id },
        {
          lastMessage: {
            text: message,
            sender: senderId,
          },
        }
      ),
    ]);

    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId)
      io.to(recipientSocketId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in sending message", error.message);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: recipientId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort("createdAt");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in getting messages", error.message);
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate({ path: "participants", select: "username profilePic" });
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (user) => user._id.toString() !== userId.toString()
      );
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("error in getting conversations", error.message);
  }
};
