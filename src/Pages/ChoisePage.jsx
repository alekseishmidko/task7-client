import React from "react";
import { Card, Col, Row } from "antd";
import { Link } from "react-router-dom";

const ChoisePage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-3xl">
        <Row gutter={16} justify="center">
          <Col span={12}>
            <Link to={"/game1"}>
              <Card title="game1" bordered={false}>
                game1
              </Card>
            </Link>
          </Col>
          <Col span={12}>
            <Link to={"/game2"}>
              <Card title="game2" bordered={false}>
                game2
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChoisePage;
