import { createSlice } from "@reduxjs/toolkit"
import { loginUser, registerUser } from "../../action/authAction"

const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequest: []
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset : () => initialState,
    handleLoginuser: (state) => {
      state.message = "hello"
    } 
  },
  extraReducers: (builder) => {

    builder
      .addCase(loginUser.pending, (state) => {
        ((state.isLoading = true), (state.message = "Signing you in ..."));
      })
      .addCase(loginUser.fulfilled, (state) => {
        ((state.isLoading = false),
          (state.isError = false),
          (state.isSuccess = true),
          (state.loggedIn = true),
          (state.message = "Login successfull !"));
      })
      .addCase(loginUser.rejected, (state, action) => {
        ((state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload as string));
      })
      .addCase(registerUser.pending, (state) => {
        ((state.isLoading = true), (state.message = "Signing you up ..."));
      })
      .addCase(registerUser.fulfilled, (state) => {
        ((state.isLoading = false),
          (state.isError = false),
          (state.isSuccess = true),
          (state.loggedIn = true),
          (state.message = "Signup successfull !"));
      })
      .addCase(registerUser.rejected, (state, action) => {
        ((state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload as string));
      });
  }
})
  
export default authSlice.reducer;