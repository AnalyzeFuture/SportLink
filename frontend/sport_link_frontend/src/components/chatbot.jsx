import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Avatar,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { GoDependabot } from "react-icons/go";

import { IoSendSharp } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";

const Chatbot = () => {
  // Chatbot visibility state
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [fetchingResponse, setFetchingResponse] = useState(false);

  // Fix: useColorModeValue is called at the top level
  const bgColor = "#2C2C2C";
  const textColor = "#3C3D37";
  const paragraphColor = "#F0F0F0";
  const buttonBgColor = "#FFBD73";
  const buttonTextColor = "#3C3D37";

  // Toggle chatbot visibility
  const toggleChatbot = () => setIsOpen(!isOpen);

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    setFetchingResponse(true);
    if (!messageText.trim()) return;

    const newMessage = { text: messageText, sender: "user" };
    setMessages([...messages, newMessage]);
    setMessageText("");

    try {
      // Fetch response from Node.js server
      const response = await fetch("api/chatbot/getQuery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: messageText }),
      });

      const data = await response.json();
      console.log(data);
      // Append chatbot response to messages
      setMessages((prev) => [
        ...prev,
        {
          text:
            data.botResponse.response || "Sorry, I couldn't understand that.",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error fetching response. Please try again.", sender: "bot" },
      ]);
    } finally {
      setFetchingResponse(false);
    }
  };

  return (
    <>
      {/* Floating chatbot button */}
      <Button
        position="fixed"
        bottom="20px"
        right="20px"
        borderRadius="full"
        p={4}
        onClick={toggleChatbot}
        bg={buttonBgColor}
        color={buttonTextColor}
      >
        <FaRobot size={24} />
      </Button>

      {/* Chatbot window */}
      {isOpen && (
        <Box
          position="fixed"
          bottom="80px"
          right="5px"
          w={{ base: "95%", md: "450px" }} // Increased width
          h={{ base: "500px", md: "550px" }} // Added and increased height
          bg={bgColor}
          color={textColor}
          p={4}
          borderRadius="md"
          boxShadow="lg"
          flexDirection="column"
        >
          {/* Chat header */}
          <Flex alignItems="center" justifyContent="space-between" mb={2}>
            <Flex alignItems="center" gap={2}>
              <Avatar size="sm" icon={<GoDependabot />} />
              <Text fontWeight="bold" color="white">
                Chatbot
              </Text>
            </Flex>
            <Button size="xs" onClick={toggleChatbot}>
              ✖
            </Button>
          </Flex>
          <Divider />

          {/* Chat messages */}
          <Flex flexDir="column" gap={2} height="80%" overflowY="auto" p={2}>
            {messages.map((msg, index) => (
              <Flex
                key={index}
                alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
                bg={msg.sender === "user" ? buttonBgColor : paragraphColor}
                color={msg.sender === "user" ? buttonTextColor : textColor}
                p={2}
                borderRadius="md"
                maxW="80%"
              >
                {msg.text}
              </Flex>
            ))}
          </Flex>

          {/* Message input */}
          <Box mt="auto" w="100%">
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission
                if (!fetchingResponse) {
                  handleSubmitMessage(e); // Only submit if we're not fetching a response
                }
              }}
            >
              <InputGroup mt={2}>
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  bg={paragraphColor}
                  color={textColor}
                  _placeholder={{ color: "black" }}
                />
                {fetchingResponse ? (
                  <Spinner />
                ) : (
                  <InputRightElement
                    onClick={handleSubmitMessage}
                    cursor="pointer"
                  >
                    <IoSendSharp color={buttonTextColor} />
                  </InputRightElement>
                )}
              </InputGroup>
            </form>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chatbot;
