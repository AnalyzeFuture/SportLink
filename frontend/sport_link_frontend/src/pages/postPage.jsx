/* eslint-disable react/no-unescaped-entities */
import {
  Flex,
  Avatar,
  Image,
  Text,
  Box,
  Divider,
  Button,
} from "@chakra-ui/react";
import img from "../../public/neeraj-chopra.jpg";
// import { DeleteIcon } from "@chakra-ui/icons";
import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={img} size={"md"} name="Neeraj Chopra" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              Neeraj Chopra
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            1d
          </Text>
          {/* <DeleteIcon size={20} cursor={"pointer"} /> */}
          <BsThreeDots cursor={"pointer"} />
        </Flex>
      </Flex>

      <Text my={3}> Neeraj Chopra's best throws</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src="/post1.png" w={"full"} />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          238 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {2000 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>✌️</Text>
          <Text color={"gray.light"}>
            Explore Sportlink to like, reply and post.
          </Text>
        </Flex>
        <Button>Explore</Button>
      </Flex>
      <Divider my={4} />

      <Comment
        commented="Looks really great!"
        createdAt="1d"
        likes={21}
        username="Dan Abrahmov"
        userAvatar="https://bit.ly/dan-abramov"
      />
      <Comment
        commented="Love the work"
        createdAt="4d"
        likes={50}
        username="Kent Dodds"
        userAvatar="https://bit.ly/kent-c-dodds"
      />
      <Comment
        commented="Amazing insights"
        createdAt="2d"
        likes={11}
        username="Segun Adebayo"
        userAvatar="https://bit.ly/sage-adebayo"
      />
    </>
  );
};
export default PostPage;
