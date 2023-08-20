import React from "react";
import image1 from "../assets/dice1.png";
import image2 from "../assets/dice2.png";
import image3 from "../assets/dice3.png";
import image4 from "../assets/dice4.png";
import image5 from "../assets/dice5.png";
import image6 from "../assets/dice6.png";

const Image = ({ box }) => {
  const arr = [image1, image2, image3, image4, image5, image6];

  return (
    <div className="mt-[-4px]">
      <img src={arr[box - 1]} />
    </div>
  );
};

export default Image;
