import React from "react";
import { Card, Col, Row } from "antd";
import { Link } from "react-router-dom";
import img1 from "../assets/xo.png";
import img2 from "../assets/dice.jpg";
const ChoisePage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-3xl">
        <Row gutter={16} justify="center">
          <Col span={8}>
            <Link to={"/game1"}>
              <Card title="Tic Tac Toe " bordered={false} className="h-full">
                <img src={img1} alt="1" className="h-full" />
              </Card>
            </Link>
          </Col>
          <Col span={8}>
            <Link to={"/game2"}>
              <Card title="Dice" bordered={false} className="h-full">
                <img src={img2} alt="2" className="h-full" />
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChoisePage;
