import { Box, Container } from "@chakra-ui/react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useSelector } from "react-redux";
import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import LoginButton from "./components/LoginButton";
import ChatPage from "./pages/ChatPage";

function App() {
  const user = useSelector((state) => state.user);
  return (
    <Box position={"relative"} width={"full"}>
      <Container maxWidth={"620px"}>
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={user ? <Navigate to="/" /> : <AuthPage />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to={"/auth"} />}
          />
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
        </Routes>
        {/* {user ? <LogoutButton /> : <LoginButton />} */}
      </Container>
    </Box>
  );
}

export default App;
