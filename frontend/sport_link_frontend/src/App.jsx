// eslint-disable-next-line no-unused-vars
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import Userpage from "./pages/UserPage";
import Postpage from "./pages/postPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import userAtom from "./atoms/userAtom";
import { useRecoilValue } from "recoil";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";

function App() {
  const user = useRecoilValue(userAtom);
  console.log(user);
  return (
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
              <Userpage />
            )
          }
        />
        <Route
          path="/:username/post/:pid"
          element={user ? <Postpage /> : <Navigate to={"/auth"} />}
        />
      </Routes>
    </Container>
  );
}

export default App;
