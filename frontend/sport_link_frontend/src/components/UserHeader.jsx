import { Avatar, Button } from "@chakra-ui/react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BsInstagram } from "react-icons/bs";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react";
// import img from "../assets/neeraj-chopra.jpg";
import { useToast } from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
// import {Link  as RouterLink} from "react-router-dom";

const UserHeader = ({ user, setView }) => {
  //user whose profile is being viewed
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); //this is logged in user
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);

  const showToast = useShowToast();
  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please Login to follow the user");
      return;
    }
    if (updating) return; //If you click the button againg while updating it will exit
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "appplication/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "Error");
        return;
      }

      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop(); //Only updates user on the client side
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(currentUser?._id); // Only updates user on the client side
      }

      setFollowing(!following);
      console.log(data);
    } catch (error) {
      showToast("Error", error, "Error");
    } finally {
      setUpdating(false);
    }
  };

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"blackAlpha.100"}
              color={"purple.500"}
              p={1}
              borderRadius={"full"}
            >
              sport.link
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "lg",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https:bit.ly/broken-link"
              size={{
                base: "md",
                md: "lg",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currentUser?._id === user._id && (
        <Link to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "UnFollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>{user.district}</Link>
          <Link color={"gray.light"}>{user.state}</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>

          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          onClick={() => setView("posts")}
        >
          <Text fontWeight={"bold"}>Posts</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
          onClick={() => setView("analysis")}
        >
          <Text fontWeight={"bold"}> Analysis</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

UserHeader.propTypes = {
  user: PropTypes.node,
  setView: PropTypes.func.isRequired,
};

export default UserHeader;
// $2a$10$mo23TW4dvvlDrQTycQIXWewjLX2Z1wEy7p8x.rQkUPhfUxzjJvhgW
