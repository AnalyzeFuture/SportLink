// eslint-disable-next-line no-unused-vars
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import Userpage from "./pages/UserPage";
import Postpage from "./pages/postPage";
import Header from "./components/Header";
function App() {
  return (
    <Container maxW="620px">
      <Header />

      <Routes>
        <Route path="/:username" element={<Userpage />} />
        <Route path="/:username/post/:pid" element={<Postpage />} />
      </Routes>
    </Container>
  );
}

export default App;
