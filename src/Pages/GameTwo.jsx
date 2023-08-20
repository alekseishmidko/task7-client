import React, { useState, useEffect, useCallback } from "react";
import { useClipboard } from "use-clipboard-copy";
import io from "socket.io-client";
import { Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Image from "../components/Image";
import { nanoid } from "nanoid";

const GameTwo = () => {
  const socket = io("https://task-7-server-sm7e.onrender.com");
  const location = useLocation();
  // const params = new URLSearchParams(location.search);
  const paramsRoom = new URLSearchParams(location.search).get("room");
  // id room
  const [myTurn, setMyTurn] = useState(true);
  const [room, setRoom] = useState(paramsRoom);
  const [opponent, setOpponent] = useState(false);
  const [box1, setBox1] = useState("");
  const [box2, setBox2] = useState("");
  const [win, setWin] = useState(false);
  const [result, setResult] = useState("");
  const [player, setPlayer] = useState("left");
  const navigate = useNavigate();

  const sendRestart = () => {
    socket.emit("reqRestart", JSON.stringify({ room }));
  };
  const restart = () => {
    setWin(false);
    setBox1("");
    setBox2("");
    setMyTurn(false);
    setPlayer("left");
    setResult("");
    socket.on("restart", () => {
      restart();
    });
  };

  //начало игры
  useEffect(() => {
    if (!paramsRoom) {
      const newRoomName = nanoid(9);
      socket.emit("create", newRoomName);
      setRoom(newRoomName);
      setMyTurn(true);
      setPlayer("left");
    } else {
      socket.emit("join", paramsRoom);
      setRoom(paramsRoom);
      setMyTurn(false);
      setPlayer("left");
    }
  }, [paramsRoom]);
  //
  const clipboard = useClipboard();
  const shareLink = useCallback(() => {
    const url = `${window.location.href}?room=${room}`;
    clipboard.copy(url);
    message.success("Link copied to clipboard");
  }, [clipboard.copy, room]);

  const handleLeft = () => {
    if (box1 === "" && player === "left") {
      socket.emit("clickLeft", { room });
    }
    socket.on("responceLeft", (data) => {
      console.log(data);
      if (player === "left" && opponent === true) {
        console.log(data);
        setBox1(data);
        setMyTurn(!myTurn);
        setPlayer("right");
      }
    });
  };
  const determ = (box1, box2) => {
    if (box1 !== "" && box2 !== "") {
      const a = Number(box1) - Number(box2);
      if (a < 0) {
        setResult("Right player win!");
      }
      if (a > 0) {
        setResult("Left player win!");
      }
      if (a == 0) {
        setResult("Draw");
      }
    }
  };
  const handleRight = () => {
    if (box2 === "" && player === "right") {
      socket.emit("clickRight", { room });
    }
    socket.on("responceRight", (data) => {
      console.log(data);
      if (player === "right") {
        console.log(data);
        setBox2(data);
        setMyTurn(!myTurn);
      }
    });
  };

  useEffect(() => {
    socket.on("connection", () => {
      console.log("Connected to server");
    });
    socket.on("opponent_joined", () => {
      setOpponent(true);
      socket.emit("reqTurn", JSON.stringify({ room }));
    });
    socket.on("responceRight", (data) => {
      console.log(data);
      if (player === "right") {
        console.log(data);
        setBox2(data);
        setMyTurn(!myTurn);
      }
    });
  }, [player, myTurn, socket, box1, box2]);
  useEffect(() => {
    socket.on("opponent_joined", () => {
      setOpponent(true);
    });
    socket.on("responceLeft", (data) => {
      console.log(data, "111");
      if (player === "left" && opponent === true) {
        console.log(data, "222");
        setBox1(data);
        setMyTurn(!myTurn);
        setPlayer("right");
      }
    });
  }, [player, myTurn, socket]);

  useEffect(() => {
    if (box1 !== "" && box2 !== "") {
      setWin(true);

      const a = Number(box1) - Number(box2);
      if (a < 0) {
        setResult("Right player win!");
      }
      if (a > 0) {
        setResult("Left player win!");
      }
      if (a == 0) {
        setResult("Draw");
      }
    }
  }, [box1, box2]);
  console.log(result, "result");
  useEffect(() => {
    socket.on("restart", () => {
      restart();
    });

    socket.on("opponent_joined", () => {
      setOpponent(true);
    });
  }, [opponent, socket]);
  console.log(opponent, "opponent", player, "player");
  return (
    <div>
      <ArrowLeftOutlined
        onClick={() => navigate("/choise")}
        className="ml-4 mt-2  cursor-pointer text-xl hover:text-blue-500 transform hover:scale-110 transition duration-300"
      />

      {/*  */}
      <div className="absolute top-1/5 mt-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white p-8 rounded-md shadow-lg">
        <div className="flex items-center mb-4">
          <span className="text-xl text-darkgreen font-bold">Room:</span>
          <span className="ml-2 text-darkgreen font-bold">{room}</span>
          <Button
            title="Share link"
            className="ml-8 border border-blue-500 rounded-md h-30 w-70 hover:cursor-pointer hover:text-white hover:bg-blue-500"
            onClick={shareLink}
          >
            Share link
          </Button>
        </div>
        <div className="mb-4">
          Move:
          {myTurn ? (
            <span className="text-darkgreen font-bold pl-2">Your move</span>
          ) : (
            <span className="text-darkred font-bold pl-2">Opponent move</span>
          )}
        </div>
        {win ? (
          <Button
            className="border border-blue-500 rounded-md h-30 w-70 hover:cursor-pointer hover:text-white hover:bg-blue-500"
            onClick={sendRestart}
          >
            Restart Game
          </Button>
        ) : null}
        {!opponent && (
          <span className="text-lg text-black-600 mt-4">
            The second player has not joined yet! Waiting...
          </span>
        )}

        <p className="text-lg text-black-600 mt-4">
          {result !== "" ? <span>{result}</span> : ""}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex ">
          <div
            className={
              box1 === ""
                ? "w-48 h-48  border border-black rounded-2xl ml-4"
                : "w-48 h-[48px] border border-black rounded-2xl mr-4"
            }
            onClick={handleLeft}
          >
            <Image box={box1} />
          </div>
          <div
            className={
              box2 === ""
                ? "w-48 h-48  border border-black rounded-2xl ml-4"
                : "w-48 h-[48px] border border-black rounded-2xl mr-4"
            }
            onClick={handleRight}
          >
            <Image box={box2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTwo;
