import { useState, useEffect } from "react";
import { Layout, Input, Button, List, Avatar, AutoComplete } from "antd";
import { UserOutlined, RollbackOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Content, Sider } = Layout;
import Tags from "../components/Tags";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetMessages,
  fetchPostMessage,
  setTags,
} from "../store/slices/dataSlice";
import socketIO from "socket.io-client";
const ChatApp = () => {
  const messages = useSelector((state) => state.dataSlice.allMessages);
  const isLoading = useSelector((state) => state.dataSlice.isLoading);
  const [inputMessage, setInputMessage] = useState("");
  const dispatch = useDispatch();
  const { currentUser, currentTags } = useSelector((state) => state.dataSlice);
  // socket logics
  const socket = socketIO.connect("https://task-6-server-am9o.onrender.com");

  function extractHashtags(inputString) {
    const words = inputString.split(/\s+/); // Разбиваем строку на слова
    const hashtags = [];

    words.forEach((word) => {
      if (word.startsWith("#")) {
        hashtags.push(word); // Удаляем символ # .substring(1)
      }
    });

    return hashtags;
  }
  //
  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const userHashtags = extractHashtags(inputMessage);
      console.log(userHashtags, "userhashtags");
      //
      socket.emit("message", {
        text: inputMessage,
        tags: userHashtags,
        user: currentUser,
        userID: `${socket.id}`,
        socketID: socket.id,
      });

      //
      dispatch(
        fetchPostMessage({
          text: inputMessage,
          tags: userHashtags,
          user: currentUser,
        })
      );
      setInputMessage("");
    }
  };
  useEffect(() => {
    socket.on("responce", (data) => {
      console.log(data);
      dispatch(fetchGetMessages());
    });
  }, []);

  // const onClickTag = (e) => {
  //   console.log(e.target.innerText);
  //   dispatch(setTags(e.target.innerText));
  // };
  if (isLoading === "loading") {
    return <h3>Loading</h3>;
  }
  const unic = JSON.parse(localStorage.getItem("allUnicTags"));
  const tagChildren = unic.map((tag) => ({ value: tag }));
  return (
    <>
      <Link to={"/"}>
        <div className="">
          <div className="ml-6  cursor-pointer   ">
            <RollbackOutlined />
          </div>
        </div>
      </Link>

      <Layout className="">
        <Sider width={160} style={{ background: "#fff", padding: "20px" }}>
          <h2>Filter Tags</h2>
          <div className="mt-4">
            <Tags />
          </div>
        </Sider>

        <Content style={{ padding: "20px" }}>
          <List
            size="small"
            dataSource={messages.filter(
              (message) =>
                currentTags.length === 0 ||
                message.tags.length === 0 ||
                message.tags.some((tag) => currentTags.includes(tag))
            )}
            renderItem={(item) => (
              <List.Item className="flex items-center justify-start p-2">
                <List.Item.Meta
                  className="mt-2 mb-4"
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    item.user === currentUser ? (
                      <span>
                        <span style={{ fontWeight: "bold", color: "green" }}>
                          {item.user}
                        </span>
                        <span> write: </span>
                      </span>
                    ) : (
                      <span>
                        <span style={{ fontWeight: "bolder", color: "navy" }}>
                          {item.user}
                        </span>
                        <span> write: </span>
                      </span>
                    )
                  }
                  description={
                    <span
                      style={{
                        fontSize: 16,
                        fontStyle: "normal",
                        color: "ActiveCaption",
                      }}
                    >
                      {item.text}
                    </span>
                  }
                />
                {/* <List.Item.Meta
                  onClick={(e) => onClickTag(e)}
                  className="cursor-pointer"
                  description={item.tags.map((it, index) => {
                    return <span key={index}> {it} </span>;
                  })}
                /> */}
              </List.Item>
            )}
          />
        </Content>
        <div className="fixed top-0 right-0 h-full p-4 bg-white shadow-md z-30 flex flex-col ">
          {/* <Input.TextArea
            placeholder="Enter your message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onPressEnter={handleSendMessage}
            className="h-40 resize-y"
            rows={4}
          /> */}

          <AutoComplete
            placeholder="Enter your message"
            value={inputMessage}
            options={tagChildren}
            onSearch={(value) => setInputMessage(value)}
            onSelect={(value) => setInputMessage((prev) => prev + value)}
            onPressEnter={handleSendMessage}
            size="large"
            style={{ width: 300 }}
            bordered={false}
            rows={4}
          />

          <Button
            type="primary"
            onClick={handleSendMessage}
            className=" rounded bg-blue-300 hover:bg-blue-600 mt-4"
          >
            Send
          </Button>
        </div>
      </Layout>
    </>
  );
};

export default ChatApp;
