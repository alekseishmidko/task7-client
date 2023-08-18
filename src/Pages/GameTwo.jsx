import React, { useState, useEffect, useCallback } from "react";
import { useClipboard } from "use-clipboard-copy";
import io from "socket.io-client";
import { Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { nanoid } from "nanoid";
const socket = io("http://localhost:3001");

const GameTwo = () => {
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
  };
  const handleRight = () => {
    if (box2 === "" && player === "right") {
      socket.emit("clickRight", { room });
    }
  };

  useEffect(() => {
    socket.on("responceRight", (data) => {
      console.log(data);
      if (player === "right") {
        console.log(data);
        setBox2(data);
        setMyTurn(!myTurn);
      }
    });
  }, [player, myTurn, socket]);
  useEffect(() => {
    socket.on("responceLeft", (data) => {
      console.log(data);
      if (player === "left" && opponent === true) {
        console.log(data);
        setBox1(data);
        setMyTurn(!myTurn);
        setPlayer("right");
      }
    });
  }, [player, myTurn, socket]);

  useEffect(() => {
    if (box1 !== "" && box2 !== "") {
      setWin(true);
    }
  }, [box1, box2]);
  useEffect(() => {
    socket.on("restart", () => {
      restart();
    });

    socket.on("opponent_joined", () => {
      setOpponent(true);
    });
  }, [opponent]);
  console.log(opponent, "opponent", player, "player");
  return (
    <div>
      <ArrowLeftOutlined
        onClick={() => navigate(-1)}
        className="ml-4 mt-2  cursor-pointer text-xl hover:text-blue-500 transform hover:scale-110 transition duration-300"
      />
      <div className=" absolute flex mt-12 top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        Room:
        <span style={{ color: "darkgreen" }} className="ml-2 font-bold">
          {room}
        </span>
        <Button
          title="Share link"
          className="float-right bg-white border ml-20 border-blue-500 rounded-md h-30 w-70 hover:cursor-pointer hover:text-white hover:bg-blue-500"
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
      </div>
      {win ? (
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

      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex ">
          <div className="w-52 h-52 bg-blue-500 mr-4" onClick={handleLeft}>
            {box1}
          </div>
          <div className="w-52 h-52 bg-red-500 ml-4" onClick={handleRight}>
            {box2}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTwo;
