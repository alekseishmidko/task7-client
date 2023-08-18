import React from "react";

const Square = ({ turn, index, value }) => {
  return (
    <div
      className="w-48 h-48 border border-blue-400  text-center leading-48text-3xl font-bold"
      onClick={() => turn(index)}
    >
      <span className="w-full h-full flex justify-center items-center  font-light  text-blue-600  text-6xl">
        {value}
      </span>
    </div>
  );
};

export default Square;
