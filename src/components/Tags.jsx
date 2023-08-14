import React, { useEffect, useRef, useState } from "react";
import { AutoComplete, Tag, theme } from "antd";
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
    dispatch(deleteTags(newTags));
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      dispatch(setTags(inputValue.toLowerCase()));
    }
    setInputVisible(false);
    setInputValue("");
  };

  const tagChildren = tags.map((tag) => ({ value: tag }));

  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
    cursor: "pointer",
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        {tags.map((tag) => (
          <Tag
            key={tag}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 8,
            }}
            closable
            onClose={() => handleClose(tag)}
          >
            <span style={{ fontSize: 12, fontWeight: 400, paddingBottom: 1 }}>
              {tag}
            </span>
          </Tag>
        ))}
      </div>
      {inputVisible ? (
        <AutoComplete
          ref={inputRef}
          options={tagChildren}
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
