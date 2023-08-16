import React, { useState, useEffect, useCallback } from "react";
import Box from "../components/Box";
import { useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useClipboard } from "use-clipboard-copy";
import { io } from "socket.io-client";
import { combs } from "../midwares/combs";
import { useSelector } from "react-redux";
const GameFirst = () => {
  const socket = io("http://localhost:3001");
  const navigate = useNavigate();
  const playerName = useSelector((state) => state.dataSlice.currentUser);
  console.log(playerName);
  //
  const [game, setGame] = useState(Array(9).fill(""));
  const [turnNumber, setTurnNumber] = useState(0);
  const [myTurn, setMyTurn] = useState(true);
  const [win, setWin] = useState(false);
  const [moveSign, setMoveSign] = useState("X");

  const [opponent, setOpponent] = useState(false);
  const [turnData, setTurnData] = useState(false);
  const [player, setPlayer] = useState("");

  const location = useLocation();
  // const params = new URLSearchParams(location.search);
  const paramsRoom = new URLSearchParams(location.search).get("room");
  // id room
  const [room, setRoom] = useState(paramsRoom);

  const turn = (index) => {
    if (!game[index] && !win && myTurn && opponent) {
      socket.emit("reqTurn", JSON.stringify({ index, value: moveSign, room }));
    }
  };

  const sendRestart = () => {
    socket.emit("reqRestart", JSON.stringify({ room }));
  };

  const restart = () => {
    setGame(Array(9).fill(""));
    setWin(false);
    setTurnNumber(0);
    setMyTurn(false);
    socket.on("restart", () => {
      restart();
    });
  };

  useEffect(() => {
    combs.forEach((item) => {
      if (
        game[item[0]] === game[item[1]] &&
        game[item[0]] === game[item[2]] &&
        game[item[0]] !== ""
      ) {
        setWin(true);
      }
    });

    if (turnNumber === 0) {
      setMyTurn(moveSign === "X" ? true : false);
    }
  }, [game, turnNumber, moveSign]);

  useEffect(() => {
    socket.on("playerTurn", (json) => {
      setTurnData(json);
    });

    socket.on("restart", () => {
      restart();
    });

    socket.on("opponent_joined", () => {
      setOpponent(true);
    });
  }, []);

  useEffect(() => {
    if (turnData) {
      const data = JSON.parse(turnData);
      let g = [...game];
      if (!g[data.index] && !win) {
        g[data.index] = data.value;
        setGame(g);
        setTurnNumber(turnNumber + 1);
        setTurnData(false);
        setMyTurn(!myTurn);
        setPlayer(data.value);
      }
    }
  }, [turnData, game, turnNumber, win, myTurn]);

  useEffect(() => {
    if (!paramsRoom) {
      const newRoomName = nanoid(9);
      socket.emit("create", newRoomName);
      console.log(newRoomName, "newRoomName");
      setRoom(newRoomName);
      setMyTurn(true);
    } else {
      setMoveSign("O");
      socket.emit("join", paramsRoom);
      setRoom(paramsRoom);
      setMyTurn(false);
    }
  }, [paramsRoom]);

  const clipboard = useClipboard();
  const shareLink = useCallback(() => {
    const url = `${window.location.href}?room=${room}`;
    clipboard.copy(url);
    message.success("Link copied to clipboard");
  }, [clipboard.copy, room]);
  return (
    <div>
      <ArrowLeftOutlined
        onClick={() => navigate(-1)}
        className="ml-4 mt-2  cursor-pointer text-xl hover:text-blue-500 transform hover:scale-110 transition duration-300"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        Room:
        <span style={{ color: "darkgreen", fontWeight: "bold" }}> {room}</span>
        <Button
          title="Share link"
          className="float-right bg-white border border-blue-500 rounded-md h-30 w-70 hover:cursor-pointer hover:text-white hover:bg-blue-500"
          onClick={shareLink}
        >
          Share link
        </Button>
        <div>
          Move:{" "}
          {myTurn ? (
            <span style={{ color: "darkgreen", fontWeight: "bold" }}>
              Your move
            </span>
          ) : (
            <span style={{ color: "darkred", fontWeight: "bold" }}>
              Opponent move
            </span>
          )}
        </div>
        {win || turnNumber === 9 ? (
          <Button
            className="float-right bg-white border border-blue-500 rounded-md h-30 w-70 hover:cursor-pointer hover:text-white hover:bg-blue-500"
            onClick={sendRestart}
          >
            Restart Game
          </Button>
        ) : null}
        <br />
        {opponent ? (
          ""
        ) : (
          <span className="text-lg text-black-600 ">
            The second player has not joined yet! Waiting...
          </span>
        )}
        <p>
          {win ? (
            <span>Winner is: {player}</span>
          ) : turnNumber === 9 ? (
            <span>Draw!</span>
          ) : (
            <br />
          )}
        </p>
        <div className="grid grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => (
            <Box key={index} index={index} turn={turn} value={game[index]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameFirst;
