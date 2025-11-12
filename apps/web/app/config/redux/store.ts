import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducer/authReducer/index"

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
})