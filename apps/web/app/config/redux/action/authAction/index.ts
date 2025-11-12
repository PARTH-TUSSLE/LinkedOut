import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../..";

export const loginUser = createAsyncThunk("user/signin", async ( user: { email: string; username: string; password: string }, thunkAPI ) => {
  try {

    const response = await clientServer.post("/signin", {
      email: user.email,
      username: user.username,
      password: user.password
    })

    if ( response.data.token ) {
      localStorage.setItem("token", response.data.token);
    } else {
    return thunkAPI.rejectWithValue({
      message: "token not provided"
    });
    }

    return thunkAPI.fulfillWithValue(response.data.token);
    
  } catch (error) {
    return thunkAPI.rejectWithValue((error as any ).response.data)
  }
})

export const registerUser = createAsyncThunk("/user/signup", ( user, thunkAPI ) => {

})