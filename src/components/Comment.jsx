/* eslint-disable react/prop-types */
import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic || ""} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"} textAlign={"initial"}>
          <Flex w={"full"} justifyContent={"space-between"}>
            <Text fontSize="sm" fontWeight="bold">
              {reply.username}
            </Text>
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!lastReply && <Divider my={1} />}
    </>
  );
};

export default Comment;
