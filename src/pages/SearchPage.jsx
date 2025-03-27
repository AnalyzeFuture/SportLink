import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const SearchPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const navigate = useNavigate();
  const showToast = useShowToast();

  const handleUserSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchText: searchText }),
      });
      const users = await res.json();
      if (users.error) {
        showToast("Error", users.error, "error");
        return;
      }
      console.log("handleUserSearch User :", users);
      setSearchedUsers(users);
    } catch (error) {
      showToast("error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <>
      <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
        search for a user
      </Text>
      <form onSubmit={handleUserSearch}>
        <Flex alignItems={"center"} gap={2}>
          <Input
            placeholder="Search for a user"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            size={"sm"}
            onClick={handleUserSearch}
            isLoading={searchingUser}
          >
            <SearchIcon />
          </Button>
        </Flex>
      </form>
      {searchingUser &&
        [0, 1, 2, 3, 4].map((_, i) => (
          <Flex
            key={i}
            gap={4}
            alignItems={"center"}
            p={"1"}
            borderRadius={"md"}
          >
            <Box>
              <SkeletonCircle size={"10"} />
            </Box>
            <Flex w={"full"} flexDirection={"column"} gap={3}>
              <Skeleton h={"10px"} w={"80px"} />
              <Skeleton h={"8px"} w={"90%"} />
            </Flex>
          </Flex>
        ))}

      {!searchingUser && searchedUsers?.length === 0 && <h1>No user Found</h1>}
      {!searchingUser &&
        searchedUsers?.map((user) => (
          <User key={user._id} user={user} navigate={navigate} />
        ))}
      {/* <User /> */}
    </>
  );
};

const User = ({ user, navigate }) => {
  useEffect(() => {
    console.log("user in map", user);
  });
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      onClick={() => navigate(`/${user.username}`)}
      borderRadius={"md"}
    >
      {" "}
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user?.profilePic}
        ></Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
          {/* {user?.username || "Unknown User"} */}
          {user?.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {user?.followers.length}
        </Text>
      </Stack>
    </Flex>
  );
};

User.propTypes = {
  user: PropTypes.node,
  navigate: PropTypes.func,
};

export default SearchPage;
