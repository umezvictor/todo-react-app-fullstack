import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userSlice from "../features/userSlice";
import todoSlice from "../features/todoSlice";

import { combineReducers } from "redux";

// Combine your reducers (especially if you have multiple slices)
const rootReducer = combineReducers({
  user: userSlice,
  todo: todoSlice,
});

// When logout is dispatched, reset all sub-slices to their initial state

//persist state when user refreshes the page
const persistConfig = {
  key: "root", // key for localStorage
  storage, // storage engine (localStorage)
  whitelist: ["todo", "user"], // which slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
