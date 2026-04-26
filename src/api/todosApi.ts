import type {
  AddTodoApiResponse,
  AddTodoRequest,
  TodosApiResponse,
} from "../types";
import { APICore } from "./apiCore";

const api = new APICore();

export const fetchTodosAsync = async (
  offset: number,
): Promise<TodosApiResponse> => {
  try {
    const response = await api.getGeneric(
      `https://localhost:7024/api/todos/paginated/${offset}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const addTodoAsync = async (
  payload: AddTodoRequest,
): Promise<AddTodoApiResponse> => {
  try {
    const response = await api.createGeneric(
      "https://localhost:7024/api/todos",
      payload,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
