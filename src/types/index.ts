// Todo type
export interface TodoItem {
  todoItemId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface User {
  email: string;
  username: string;
}

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  totalCount?: number;
  errors: string[];
  data: T;
}

export interface UserState {
  value: {
    user: User | null;
    isLoading: boolean;
    isUserCreated: boolean;
    message: string | null;
  };
}

export interface TodoState {
  value: {
    todo: TodoItem | null;
    todos: TodoItem[] | null;
    isLoading: boolean;
    error: string | null;
    isAddTodoModalOpen: boolean;
    totalCount: number; //this will hold the total count of todos for pagination
  };
}

export interface PageClickEvent {
  selected: number;
}

//api response

export interface TodosApiResponse {
  isSuccess: boolean;
  isFailure: boolean;
  error: ApiError;
  value: TodosPaginatedValue;
}

export interface ApiError {
  code: string;
  description: string;
  type: number;
}

export interface TodosPaginatedValue {
  todos: TodoItem[];
  totalCount: number;
}

export interface AddTodoRequest {
  title: string;
}

export interface AddTodoApiResponse {
  isSuccess: boolean;
  isFailure: boolean;
  error: ApiError;
  value: string;
}

export interface ApiError {
  code: string;
  description: string;
  type: number;
}
