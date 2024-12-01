import { BrowserRouter, Route, Routes } from "react-router";
import { SocketProvider } from "./providers/socket";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import Chat from "./pages/chat";
import { useStore } from "./state/chat";
import { useEffect } from "react";

const App: React.FC = () => {
  const user = useStore((state) => state.user)
  useEffect(() => {
    const handlePageLoad = () => {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    };
    handlePageLoad();

  }, []);
  console.log(user)
  return (
    <SocketProvider userId={user._id}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
};

export default App;
