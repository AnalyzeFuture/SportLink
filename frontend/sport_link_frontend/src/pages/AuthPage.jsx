import { Flex } from "@chakra-ui/react";
import SignupCard from "../components/SignupCard";
import videoplay from "../assets/video.webm";
import { useEffect } from "react";

const AuthPage = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent scrolling
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling on unmount
    };
  }, []);

  return (
    <Flex
      minH={"70vh"}
      align={"center"}
      justify={"center"}
      position="relative"
      overflow="hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: "fixed", // Keeps video in place
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={videoplay} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for opacity effect */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent effect
          zIndex: -1, // Keep it behind the content
        }}
      ></div>

      {/* Foreground Content */}
      <SignupCard />
    </Flex>
  );
};

export default AuthPage;
