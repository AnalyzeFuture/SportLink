import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messageAtom";
import Conversation from "./Conversation";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!messageText) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      // console.log("messageText: ", messageText);
      // console.log("sender:", data.sender);

      console.log(
        "conversations before updating setConversations inside handlesubmit button:\n",
        conversations
      );
      console.log("selectedConversation: ", selectedConversation);

      setMessages((messages) => [...messages, data]);
      setConversations((prevCons) => {
        const updateConversations = prevCons.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        console.log("setConversations: ", updateConversations);
        return updateConversations;
      });

      setMessageText("");
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return (
    <form onSubmit={handleSubmitMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="Type a message"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <InputRightElement onClick={handleSubmitMessage} cursor={"pointer"}>
          <IoSendSharp color="green.500" />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
