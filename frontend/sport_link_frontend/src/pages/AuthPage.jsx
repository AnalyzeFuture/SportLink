import { Flex } from "@chakra-ui/react";
import SignupCard from "../components/SignupCard";

const AuthPage = () => {
  return (
    <Flex minH={"70vh"} align={"center"} justify={"center"}>
      <SignupCard />
    </Flex>
  );
};

export default AuthPage;
