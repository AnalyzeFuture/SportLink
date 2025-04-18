import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Container } from "@chakra-ui/react";
import Userpage from "./pages/UserPage";
import Postpage from "./pages/postPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import userAtom from "./atoms/userAtom";
import { useRecoilValue } from "recoil";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import SearchPage from "./pages/SearchPage";
import Chatbot from "./components/chatbot";

function App() {
  const user = useRecoilValue(userAtom);
  console.log("user in app.jsx ", user);
  return (
    <Box position={"relative"} w="full">
      <Container maxW="620px">
        <Header />

        <Routes>
          <Route
            path="/"
            element={user ? <>
             <HomePage /> 
            </>
             : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <CreatePost />
                  <Userpage />
                </>
              ) : (
                <Navigate to={"/auth"} />
              )
            }
          />
          <Route
            path="/:username/post/:pid"
            element={user ? <Postpage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/search"
            element={user ? <SearchPage /> : <Navigate to={"/auth"} />}
          />
        </Routes>
      </Container>
      <Chatbot />
    </Box>
  );
}

export default App;
