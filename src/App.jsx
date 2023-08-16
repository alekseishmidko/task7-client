import { Route, Routes } from "react-router-dom";
import ChoisePage from "./Pages/ChoisePage";
import Login from "./Pages/Login";
import GameFirst from "./Pages/GameFirst";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/choise" element={<ChoisePage />} />
        <Route path="/game1" element={<GameFirst />} />
      </Routes>
    </>
  );
}

export default App;
