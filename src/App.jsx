import { Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Login from "./Pages/Login";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </>
  );
}

export default App;
//
