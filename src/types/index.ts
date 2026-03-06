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
    totalCount: number; //this will hold the total count of todos for pagination
  };
}
