import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../axios.js";
const initialState = {
  currentUser: "",
  currentTags: [],
  allUnicTags: [],
  allMessages: [],
  isLoading: "loading",
};

export const fetchGetMessages = createAsyncThunk(
  "auth/getMessages",
  async (thunkAPI) => {
    try {
      const response = await axios.get("auth/getMessages");
      localStorage.setItem(
        "allUnicTags",
        JSON.stringify(response.data.allUnicTags)
      );
      return response.data;
    } catch (error) {
      // throw error;
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const fetchPostMessage = createAsyncThunk(
  "auth/message",
  async ({ text, tags, user }, thunkAPI) => {
    try {
      const response = await axios.post("auth/message", { text, tags, user });

      return response.data;
    } catch (error) {
      // throw error;
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    enter: (state, action) => {
      state.currentUser = action.payload;
    },
    setTags: (state, action) => {
      state.currentTags = [...state.currentTags, action.payload];
    },
    deleteTags: (state, action) => {
      state.currentTags = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get Messages
    builder.addCase(fetchGetMessages.pending, (state) => {
      state.isLoading = "loading";
      state.errors = null;
      state.allMessages = [];
      // state.allUnicTags = [];
    });
    builder.addCase(fetchGetMessages.fulfilled, (state, action) => {
      state.isLoading = "loaded";
      state.errors = null;
      state.allMessages = action.payload.allMessages;
      state.allUnicTags = action.payload.allUnicTags;
    });
    builder.addCase(fetchGetMessages.rejected, (state, action) => {
      state.isLoading = "error";
      state.errors = action.error.message;
      state.allMessages = [];
      state.allUnicTags = [];
    });
    // post Message
    builder.addCase(fetchPostMessage.pending, (state) => {
      state.isLoading = "loading";
      state.errors = null;
      state.allMessages = [];
      // state.allUnicTags = [];
    });
    builder.addCase(fetchPostMessage.fulfilled, (state, action) => {
      state.isLoading = "loaded";
      state.errors = null;
      state.allMessages = action.payload.allMessages;
      state.allUnicTags = action.payload.allUnicTags;
    });
    builder.addCase(fetchPostMessage.rejected, (state, action) => {
      state.isLoading = "error";
      state.errors = action.error.message;
      state.allMessages = [];
      state.allUnicTags = [];
    });
  },
});
export const dataReducer = dataSlice.reducer;
export const { enter, setTags, deleteTags } = dataSlice.actions;
