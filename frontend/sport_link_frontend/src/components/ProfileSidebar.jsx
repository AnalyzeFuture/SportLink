import { Box, Avatar, Text, Link, VStack } from "@chakra-ui/react";
import {
  FaEye,
  FaRegNewspaper,
  FaBookmark,
  FaUsers,
  FaCalendar,
} from "react-icons/fa";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { data } from "react-router-dom";

const ProfileSidebar = () => {
  let user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [currentUser, setCurrentUser] = useState(user);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${user.username}`);
        const data = await res.json();
        console.log("get Posts data: ", data);
        setCurrentUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setCurrentUser(data);
      }
    };
    // console.log("inside user page user : ", user);
    getUser();
  }, [showToast, setCurrentUser]);
  console.log("user in profile sidebar", user);
  return (
    <Box
      bg="#1E201E"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      w="full"
      textAlign="center"
    >
      {/* Profile Section */}
      <VStack spacing={4}>
        <Avatar name={user?.name} size="xl" src={user?.profilePic} />
        <Text fontWeight="bold" fontSize="md">
          {user?.name || "User Name"}
        </Text>
        <Text fontSize="small" color="gray.600">
          {user?.bio || "Passionate Programmer | Developer"}
        </Text>
        <Box mt={4} textAlign="left">
          <Link display="flex" alignItems="center" gap={2} color="blue.500">
            <FaEye /> <Text>followers: {currentUser?.followers.length} </Text>
          </Link>
          <Link
            display="flex"
            alignItems="center"
            gap={2}
            color="blue.500"
            mt={2}
          >
            <FaRegNewspaper /> <Text> posts: 4 </Text>
          </Link>
        </Box>
      </VStack>

      {/* Stats Section */}

      {/* Navigation Section */}
      <Box mt={4} textAlign="left">
        <Link display="flex" alignItems="center" mt={2}>
          <FaBookmark /> <Text ml={2}>Saved Posts</Text>
        </Link>
        <Link display="flex" alignItems="center" mt={2}>
          <FaUsers /> <Text ml={2}>Coaching Centers</Text>
        </Link>
        <Link display="flex" alignItems="center" mt={2}>
          <FaRegNewspaper /> <Text ml={2}>Athlete Digest</Text>
        </Link>
        <Link display="flex" alignItems="center" mt={2}>
          <FaCalendar /> <Text ml={2}>Sports Events</Text>
        </Link>
      </Box>
    </Box>
  );
};

export default ProfileSidebar;
