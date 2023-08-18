import { Route, Routes } from "react-router-dom";
import ChoisePage from "./Pages/ChoisePage";
import Login from "./Pages/Login";
import GameTwo from "./Pages/GameTwo";
import GameFirst from "./Pages/GameFirst";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/choise" element={<ChoisePage />} />
        <Route path="/game1" element={<GameFirst />} />
        <Route path="/game2" element={<GameTwo />} />
      </Routes>
    </>
  );
}

export default App;
