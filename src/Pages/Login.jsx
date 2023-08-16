import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { validateMessages } from "../midwares/validateMessages";
import { layout } from "../midwares/layout";
import { enter } from "../store/slices/dataSlice";
// import { io } from "socket.io-client";
const Login = () => {
  // const socket = io("http://localhost:3001");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  const onFinish = (formData) => {
    try {
      dispatch(enter(formData.name));

      navigate("/choise");
    } catch (error) {
      console.error("error while fetchLogin:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-14  ">
      <Form
        layout="vertical"
        name="nest-messages"
        onFinish={onFinish}
        className="bg-white rounded px-8 pt-6 pb-8 mb-5"
        validateMessages={validateMessages}
      >
        <Form.Item
          name={"name"}
          label="Name"
          rules={[{ type: "string", required: true }]}
        >
          <Input
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full rounded bg-blue-500 hover:bg-blue-600 mt-4"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
