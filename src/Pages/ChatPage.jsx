import { useState } from "react";
import { Layout, Input, Button, List, Avatar } from "antd";
import { UserOutlined, RollbackOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Content, Sider } = Layout;
import Tags from "../components/Tags";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostMessage } from "../store/slices/dataSlice";
const ChatApp = () => {
  // const [messages, setMessages] = useState([]);
  const messages = useSelector((state) => state.dataSlice.allMessages);
  const [inputMessage, setInputMessage] = useState("");
  // const [userTags, setUserTags] = useState([]);
  // const [currentTags, setCurrentTags] = useState([]);
  const dispatch = useDispatch();
  const { currentUser, currentTags } = useSelector((state) => state.dataSlice);
  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      console.log({ inputMessage, currentTags, currentUser });
      dispatch(
        fetchPostMessage({
          text: inputMessage,
          tags: currentTags,
          user: currentUser,
        })
      );
      // setMessages([...messages, { text: inputMessage, tags: userTags }]);
      setInputMessage("");
    }
  };

  return (
    <>
      <Link to={"/"}>
        <div className="ml-6 cursor-pointer   ">
          <RollbackOutlined />
        </div>
      </Link>

      <Layout className="">
        <Sider width={160} style={{ background: "#fff", padding: "20px" }}>
          <h2>Tags</h2>
          <div className="mt-4">
            <Tags />
          </div>
        </Sider>
        <Content style={{ padding: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <Input
              placeholder="Enter your message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onPressEnter={handleSendMessage}
              className=""
            />
            <Button
              type="primary"
              onClick={handleSendMessage}
              className=" rounded bg-blue-300 hover:bg-blue-600 mt-4"
            >
              Send
            </Button>
          </div>
          <List
            dataSource={messages.filter(
              (message) =>
                currentTags.length === 0 ||
                message.tags.some((tag) => currentTags.includes(tag))
            )}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title="User"
                  description={item.text}
                  tags={item.tags}
                />
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </>
  );
};

export default ChatApp;
