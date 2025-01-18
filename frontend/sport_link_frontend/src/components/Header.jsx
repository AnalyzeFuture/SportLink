import { Box, Button, Flex, Image, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { IoIosChatbubbles } from "react-icons/io";

//header main component
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <Box alignContent={"center"}>
          <Link to="/">
            <AiFillHome size={24} />
          </Link>
        </Box>
      )}
      {!user && <Link to={"/auth"}></Link>}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={14}
        src={colorMode === "dark" ? "/letter-swhite.png" : "/letter-s.png"}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link to={"/chat"}>
            <IoIosChatbubbles size={20} />
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}

      {!user && <Link to={"/auth"}></Link>}
    </Flex>
  );
};

export default Header;
