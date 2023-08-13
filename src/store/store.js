import { configureStore } from "@reduxjs/toolkit";
import { dataReducer } from "./slices/dataSlice";
const store = configureStore({
  reducer: { dataSlice: dataReducer },
});

export default store;
