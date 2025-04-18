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
import { useEffect, useState } from "react";
import SportsParticipationChart from "./components/SportsParticipationChart";

function App() {
  const user = useRecoilValue(userAtom);
  console.log("user in app.jsx ", user);

  const [sportsParticipation, setSportsParticipation] = useState([]);

  useEffect(() => {
    const fetchSportsParticipation = async () => {
      if (!user) {
        console.log("No user logged in. Clearing sportsParticipation data.");
        setSportsParticipation([]); // Clear data if no user is logged in
        return;
      }
      try {
        console.log("Fetching sports participation data for user:", user._id);
        const res = await fetch(`/api/sports-participation/${user._id}`);
        const data = await res.json();
        console.log("API response:", data); // Debugging log
        if (res.ok && Array.isArray(data) && data.length > 0) {
          console.log("Valid data received. Updating state.");
          setSportsParticipation(data);
        } else {
          console.warn("No valid data available for the user."); // Warn if data is empty or invalid
          setSportsParticipation([]); // Set to empty array if no valid data
        }
      } catch (error) {
        console.error("Error fetching sports participation data:", error);
        setSportsParticipation([]); // Clear data on error
      }
    };

    fetchSportsParticipation();
  }, [user]); // Re-run the effect whenever the `user` changes

  return (
    <Box position={"relative"} w="full">
      {/* Show the chart only if the user is logged in */}
      {user && (
        <Box w="80%" mx="auto" mb={4}>
          <SportsParticipationChart data={sportsParticipation} />
        </Box>
      )}

      <Container maxW="620px">
        <Header />

        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
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
