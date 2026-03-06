// src/pages/TodosPage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TodosPage from "./TodosPage";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "../features/todoSlice";

// Mock dispatch for async thunks
const mockDispatch = vi.fn(() => Promise.resolve());
vi.mock("react-redux", async () => {
  const actual = await import("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

const renderWithStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: { todo: todoSlice },
    preloadedState: {
      todo: {
        value: {
          todo: null,
          todos: [],
          isLoading: false,
          error: null,
          totalCount: 0,
          ...preloadedState,
        },
      },
    },
  });
  return render(
    <Provider store={store}>
      <TodosPage />
    </Provider>
  );
};

describe("TodosPage create todo modal", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("submits the create todo form when submit button is clicked", async () => {
    renderWithStore();

    // Open modal
    fireEvent.click(screen.getByText("Create Todo"));

    // Enter todo title
    const input = screen.getByPlaceholderText("Enter todo item");
    fireEvent.change(input, { target: { value: "My new todo" } });

    // Click submit
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Button should be disabled while submitting
    expect(submitButton).toBeDisabled();

    // Wait for async dispatch to be called
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    // Modal should close (button not in the document)
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /submit/i })
      ).not.toBeInTheDocument();
    });
  });

  it("shows validation error if title is too short", async () => {
    renderWithStore();

    fireEvent.click(screen.getByText("Create Todo"));
    const input = screen.getByPlaceholderText("Enter todo item");
    fireEvent.change(input, { target: { value: "ab" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});

// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import { describe, it, expect, vi } from "vitest";
// import TodosPage from "./TodosPage";
// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";
// import todoSlice from "../features/todoSlice";
// import { Modal } from "react-bootstrap";

// //used provider to wrap the component and provide the store
// //not necessary for unprotected components
// const mockStore = configureStore({
//   reducer: {
//     todo: todoSlice, // Use your actual reducer
//   },
//   preloadedState: {
//     todo: {
//       value: {
//         todo: null,
//         todos: [],
//         isLoading: true,
//         error: null,
//         totalCount: 0,
//       }, // Provide a mock initial state
//     },
//   },
// });

// describe("TodosPage", () => {
//   it("renders without crashing", () => {
//     // Wrap the component with Provider and mock the store
//     render(
//       <Provider store={mockStore}>
//         <TodosPage />
//       </Provider>
//     );

//     expect(screen.getByText("Create Todo")).toBeInTheDocument();
//   });

//   //sumbit form test
//   it("submits the todo form when submit button is clicked", async () => {
//     // Render with override for createTodo or handleSubmitTodo if possible, or spy on them
//     const mockCreateTodo = vi.fn(); // spy function
//     // Render with override for createTodo or handleSubmitTodo if possible, or spy on them
//     render(
//       <Provider store={mockStore}>
//         <TodosPage />
//       </Provider>
//     );

//     //open modal first
//     fireEvent.click(screen.getByText("Create Todo")); //create todo is the text on the button to open the modal

//     const input = screen.getByPlaceholderText("Enter todo item");
//     fireEvent.change(input, { target: { value: "Sample todo" } });

//     const submitButton = screen.getByRole("button", { name: /submit/i });
//     fireEvent.click(submitButton);

//     // // Expect createTodo to have been called (adjust if function signature is different)
//     await waitFor(() => {
//       expect(screen.getByText(/success/i)).toBeInTheDocument();
//       //expect(mockCreateTodo).toHaveBeenCalled();
//       // or check for side effect, e.g. input clears or success UI appears
//     });
//   });
// });
