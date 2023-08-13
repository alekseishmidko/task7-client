import { useState } from "react";
import { Layout, Input, Button, List, Avatar } from "antd";
import { UserOutlined, RollbackOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Content, Sider } = Layout;
import Tags from "../components/Tags";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostMessage, setTags } from "../store/slices/dataSlice";
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

      setInputMessage("");
    }
  };
  const onClickTag = (e) => {
    dispatch(setTags(e.target.innerHTML));
  };

  return (
    <>
      <Link to={"/"}>
        <div className="flex justify-between mr-20">
          <div className="ml-6 cursor-pointer   ">
            <RollbackOutlined />
          </div>
          <div className="">
            <h3>Current User: {currentUser}</h3>
          </div>
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
            // dataSource={messages.filter(
            //   (message) =>
            //     currentTags.length === 0 ||
            //     message.tags.some((tag) => currentTags.includes(tag || ""))
            // )}
            dataSource={messages.filter(
              (message) =>
                currentTags.length === 0 ||
                message.tags.length === 0 ||
                message.tags.some((tag) => currentTags.includes(tag))
            )}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    item.user === currentUser ? (
                      <span style={{ fontWeight: "bold", color: "green" }}>
                        {item.user}
                      </span>
                    ) : (
                      <span style={{ fontWeight: "bolder", color: "navy" }}>
                        {item.user}
                      </span>
                    )
                  }
                  description={
                    <span style={{ fontSize: 16, fontStyle: "normal" }}>
                      {item.text}
                    </span>
                  }
                />
                <List.Item.Meta
                  onClick={(e) => onClickTag(e)}
                  className="cursor-pointer"
                  title={item.tags.map((it, index) => {
                    return (
                      <span className="pr-2" key={index}>
                        {it}
                      </span>
                    );
                  })}
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
