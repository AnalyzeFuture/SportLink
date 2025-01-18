import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";

const MessageInput = ({ setMessages }) => {
  return (
    <form>
      <InputGroup>
        <Input w={"full"} placeholder="Type a message" />
        <InputRightElement>
          <IoSendSharp color="green.500" />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
