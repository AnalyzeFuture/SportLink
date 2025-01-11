import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

const sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    console.log("SenderId : ", senderId);
    console.log("receipientId : ", recipientId);

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
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in messageController: ", error);
  }
};

const getMessages = async (req, res) => {
  const { otheruserId } = req.params;
  const userId = req.user._id;
  try {
    // console.log("user id : ", userId);
    // console.log("other user id : ", otheruserId);

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otheruserId] },
    });

    if (!conversation)
      return res.status(404).json({ error: "conversation not found" });

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    if (!messages) return res.status(404).json({ error: "messages not found" });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error inside the getMessages: ", error);
  }
};

export { sendMessage, getMessages };
