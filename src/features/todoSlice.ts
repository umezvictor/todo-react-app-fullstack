import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TodoItem, TodoState } from "../types";
import { APICore } from "../api/apiCore";
import { useDataFetcher } from "../hooks/data-fetcher-hook";

const initialState: TodoState = {
  value: {
    todo: null,
    todos: [],
    isLoading: true,
    error: null,
    totalCount: 0,
  },
};

//todo slice
const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        getTodosAsync.fulfilled,
        (
          state,
          action: PayloadAction<{ todos: TodoItem[]; totalCount: number }>,
        ) => {
          state.value.todos = action.payload.todos; //action.payload is returned from the api call in getTodosAsync
          state.value.totalCount = action.payload.totalCount;
        },
      )
      .addCase(
        createTodoAsync.fulfilled,
        (state, action: PayloadAction<TodoItem>) => {
          state.value.todo = action.payload;
        },
      )
      .addCase(
        updateTodoAsync.fulfilled,
        (state, action: PayloadAction<TodoItem>) => {
          state.value.todo = action.payload;
        },
      )
      .addCase(
        deleteTodoAsync.fulfilled,
        (state, action: PayloadAction<TodoItem>) => {
          state.value.todo = action.payload;
        },
      )
      .addCase(
        getTodoAsync.fulfilled,
        (state, action: PayloadAction<TodoItem>) => {
          state.value.todo = action.payload;
        },
      );
  },
});

const api = new APICore();

export const getTodosAsync = createAsyncThunk(
  "todo/getTodosAsync",
  async (offset: number) => {
    const response = await api.getGeneric(
      `https://localhost:7024/api/todos/paginated/${offset}`,
    );
    return {
      todos: response.data.value.todos,
      totalCount: response.data.value.totalItemsInDbCount, // Assuming the API returns totalCount in the response
    };
  },
);

export const createTodoAsync = createAsyncThunk(
  "todo/createTodoAsync",
  async (data: any) => {
    const response = await api.createGeneric(
      "https://localhost:7024/api/todos",
      data,
    );
    return response.data.data;
  },
);

export const updateTodoAsync = createAsyncThunk(
  "todo/updateTodoAsync",
  async (data: any) => {
    const response = await api.updateGeneric(
      "https://localhost:7024/api/todos",
      data,
    );
    return response.data.data;
  },
);

export const deleteTodoAsync = createAsyncThunk(
  "todo/deleteTodoAsync",
  async (id: string) => {
    const response = await api.deleteGeneric(
      `https://localhost:7024/api/todos/${id}`,
    );
    return response.data.value;
  },
);
export const getTodoAsync = createAsyncThunk(
  "todo/getTodoAsync",
  async (id: string) => {
    const response = await api.getGeneric(
      `https://localhost:7024/api/todos/${id}`,
    );
    return response.data.value;
  },
);

export default todoSlice.reducer;
