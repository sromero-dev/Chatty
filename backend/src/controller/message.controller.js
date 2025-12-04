import User from "../model/user.model.js";
import Message from "../model/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      // Find all users except the logged in user
      _id: { $ne: loggedInUserId },
    }).select("-password"); // Select password from decoded cookied user

    res.status(200).json(filteredUsers); // Returns filtered users
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error });
  }
};

export const getMessages = async (req, res) => {
  try {
    // Extract user data
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;

    let imageUrl;
    if (image) {
      // Upload base64 image to Cloudinary
      const uploadResponde = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponde.secure_url;
    }

    const newMessage = new Message({
      senderId: req.user._id,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //TODO: socket.io

    res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error });
  }
};
