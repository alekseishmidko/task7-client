import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../axios.js";
const initialState = {
  currentUser: "",
  // isLoading: "loading",
};

const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    enter: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   // Get Messages
  //   builder.addCase(fetchGetMessages.pending, (state) => {
  //     state.isLoading = "loading";
  //     state.errors = null;
  //     state.allMessages = [];
  //     // state.allUnicTags = [];
  //   });
  //   builder.addCase(fetchGetMessages.fulfilled, (state, action) => {
  //     state.isLoading = "loaded";
  //     state.errors = null;
  //     state.allMessages = action.payload.allMessages;
  //     state.allUnicTags = action.payload.allUnicTags;
  //   });
  //   builder.addCase(fetchGetMessages.rejected, (state, action) => {
  //     state.isLoading = "error";
  //     state.errors = action.error.message;
  //     state.allMessages = [];
  //     state.allUnicTags = [];
  //   });
  // },
});
export const dataReducer = dataSlice.reducer;
export const { enter, setTags, deleteTags } = dataSlice.actions;
