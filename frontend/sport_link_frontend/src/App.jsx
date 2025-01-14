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
import LogoutButton from "./components/LogoutButton";
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
        <Route path="/:username" element={<Userpage />} />
        <Route path="/:username/post/:pid" element={<Postpage />} />
      </Routes>
      {user && <LogoutButton />}
    </Container>
  );
}

export default App;
