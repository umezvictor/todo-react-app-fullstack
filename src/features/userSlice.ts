import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User, UserState } from "../types";
import { APICore } from "../api/apiCore";

//this is the global state for the user entity

//here i initialise the state with some initial values
const initialState: UserState = {
  value: {
    user: null,
    isLoading: true,
    isUserCreated: false,
    message: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //summary: what should happen to the state after this action is performed (eg setUser is an action)
    setUser: (state, action: PayloadAction<User>) => {
      state.value.user = action.payload;
      state.value.isLoading = false;
    },
    clearUser: (state) => {
      state.value.user = null;
      state.value.isLoading = false;
    },
    resetSignupResponse: (state) => {
      state.value.isUserCreated = false;
      state.value.message = null;
    },
  }, //use extraReducers to handle async actions
  extraReducers(builder) {
    builder.addCase(
      registerUserAsync.fulfilled,
      (
        state,
        action: PayloadAction<{ succeeded: boolean; message: string }>,
      ) => {
        state.value.isUserCreated = action.payload.succeeded;
        state.value.message = action.payload.message;
      },
    );
  },
});

const api = new APICore();

export const registerUserAsync = createAsyncThunk(
  "user/registerUserAsync",
  async (data: any) => {
    const response = await api.createGeneric(
      "https://localhost:7024/api/user",
      data,
    );
    return {
      succeeded: response.data.succeeded,
      message: response.data.message,
    };
  },
);

export const { setUser, clearUser, resetSignupResponse } = userSlice.actions;
export default userSlice.reducer;
