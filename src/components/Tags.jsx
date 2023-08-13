import React, { useEffect, useRef, useState } from "react";

import { PlusOutlined } from "@ant-design/icons";
import { TweenOneGroup } from "rc-tween-one";
import { Input, Tag, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setTags, deleteTags } from "../store/slices/dataSlice";
const Tags = () => {
  const dispatch = useDispatch();
  const { token } = theme.useToken();
  const tags = useSelector((state) => state.dataSlice.currentTags);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    // console.log(newTags, "newTags");
    dispatch(deleteTags(newTags));
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      dispatch(setTags(inputValue.toLowerCase()));
    }
    setInputVisible(false);
    setInputValue("");
  };

  const forMap = (tag) => {
    const tagElem = (
      <Tag
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="my-2 "
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 400, paddingBottom: 1 }}>
          {tag}
        </span>
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = tags.map(forMap);

  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
    cursor: "pointer",
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <TweenOneGroup
          enter={{
            scale: 0.9,
            opacity: 0,
            type: "from",
            duration: 100,
          }}
          onEnd={(e) => {
            if (e.type === "appear" || e.type === "enter") {
              e.target.style = "display: inline-block";
            }
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 500 }}
          appear={false}
        >
          {tagChild}
        </TweenOneGroup>
      </div>
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={showInput} style={tagPlusStyle}>
          <span style={{ fontSize: 16, fontWeight: "normal" }}> + </span> New
          tag
        </Tag>
      )}
    </>
  );
};

export default Tags;
