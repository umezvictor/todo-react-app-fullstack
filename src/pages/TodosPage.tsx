import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../app/store";
import {
  getTodosAsync,
  createTodoAsync,
  updateTodoAsync,
  deleteTodoAsync,
} from "../features/todoSlice";
import type { RootState } from "../app/store";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import type { TodoItem } from "../types";
import ReactPaginate from "react-paginate";

//react hook form works standalone. but i added zod to enhance the validation

//use built in validations from zod
const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
});

type CreateTodoRequest = z.infer<typeof schema>;

const updateTodoSchema = z.object({
  todoItemId: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  isCompleted: z.boolean(),
});

type UpdateTodoRequest = z.infer<typeof updateTodoSchema>;

export default function TodosPage() {
  const { todos, totalCount } = useSelector(
    (state: RootState) => state.todo.value
  );
  const dispatch = useDispatch<AppDispatch>();

  const itemsPerPage = 10;
  const [itemOffset, setItemOffset] = useState(0);

  /**
   * currentItems is only needed if you fetch all todos at once and slice them locally,
   * but with server-side pagination, you get only the relevant page from the API.
   */
  const pageCount = Math.ceil(totalCount / itemsPerPage);

  // Invoke when user click to request another page.
  interface PageClickEvent {
    selected: number;
  }

  const handlePageClick = (event: PageClickEvent): void => {
    const newOffset: number = (event.selected * itemsPerPage) % totalCount;
    setItemOffset(newOffset);
  };

  const fetchTodos = async () => {
    await dispatch(getTodosAsync(itemOffset));
  };
  useEffect(() => {
    fetchTodos();
  }, [dispatch, itemOffset]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [todo, setTodo] = useState<TodoItem | null>(null);

  const createTodo: SubmitHandler<CreateTodoRequest> = async (data) => {
    try {
      await dispatch(createTodoAsync(data));
      fetchTodos();
      setShowCreateModal(false);
    } catch (error) {
      //use root in place of title for errors not belonging to any specific fields
      setCreateTodoError("title", { message: "Enter a valid title" });
    }
  };

  //connect inputs to react-hook-form using the register function
  //this ensures react hook form will handle onchange events for the input fields
  //handleSubmit prevents default form behaviour, and ensure the data is valid before calling my custom functions like createTodo
  //handleCreateTodoRegister is the same as register, but for the create todo modal
  const {
    register: handleCreateTodoRegister,
    handleSubmit: handleSubmitTodo,
    setError: setCreateTodoError,
    reset: resetCreateTodo,
    formState: { errors: createTodoErrors, isSubmitting: isCreating },
  } = useForm<CreateTodoRequest>({
    resolver: zodResolver(schema),
  });

  //use the same useForm hook for the edit modal
  const {
    register,
    handleSubmit,
    setError,
    reset, //resets the form fields to their initial values or to the values you specify.
    formState: { isSubmitting },
  } = useForm<UpdateTodoRequest>({
    resolver: zodResolver(updateTodoSchema),
  });

  //useCallback is used to memoize the function so that it does not get recreated on every render
  const handleDeleteTodo = useCallback(
    async (id: string) => {
      await dispatch(deleteTodoAsync(id));
      fetchTodos();
    },
    [dispatch, fetchTodos] // make sure to include all external dependencies here!
  );

  const handleEditTodo = useCallback(
    (todo: TodoItem) => {
      setTodo(todo);
      reset({
        todoItemId: todo.todoItemId,
        title: todo.title,
        isCompleted: todo.isCompleted,
      });
      setShowEditModal(true);
    },
    [setTodo, reset, setShowEditModal] // dependencies
  );

  const updateTodo: SubmitHandler<UpdateTodoRequest> = async (data) => {
    try {
      await dispatch(updateTodoAsync(data));
      fetchTodos();
      setShowEditModal(false);
    } catch (error) {
      //use root in place of title for errors not belonging to any specific fields
      setError("title", { message: "Enter a valid title" });
    }
  };

  return (
    <>
      <div className="container mt-4" style={{ marginTop: 100 }}>
        <h2 className="mb-4">Todos</h2>
        <Button
          variant="primary"
          onClick={() => {
            resetCreateTodo(); // <-- Add this line to clear the form fields
            setShowCreateModal(true);
          }}
        >
          Create Todo
        </Button>
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              {/* <th>Id</th> */}
              <th>Todo Item</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos &&
              todos.length > 0 &&
              todos.map((todo) => (
                <tr key={todo.todoItemId}>
                  {/* <td>{todo.todoItemId}</td> */}
                  <td>{todo.title}</td>
                  <td>
                    <Link
                      to={`/todos/${todo.todoItemId}`}
                      className="btn btn-link text-primary"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                    <button
                      className="btn btn-link text-warning"
                      onClick={() => {
                        handleEditTodo(todo);
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-link text-danger"
                      onClick={() => handleDeleteTodo(todo.todoItemId)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          containerClassName="pagination justify-content-center mt-4"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
          disabledClassName="disabled"
        />
      </div>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitTodo(createTodo)}>
            <Form.Group>
              <Form.Label>Todo Item</Form.Label>
              <Form.Control
                {...handleCreateTodoRegister("title")} //title is the name attribute
                type="text"
                placeholder="Enter todo item"
              />
              {createTodoErrors.title && (
                <div className="text-danger">
                  {createTodoErrors.title.message}
                </div>
              )}
            </Form.Group>
            <Button
              disabled={isCreating}
              variant="primary"
              type="submit"
              className="mt-2"
            >
              {isCreating ? "Processing..." : "Submit"}
            </Button>
            {createTodoErrors.root && (
              <div className="text-danger">{createTodoErrors.root.message}</div>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(updateTodo)}>
            <Form.Control type="hidden" {...register("todoItemId")} />
            <Form.Group>
              <Form.Label>Todo Item</Form.Label>
              <Form.Control
                {...register("title")}
                type="text"
                placeholder="Edit todo item"
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Check
                type="checkbox"
                label="Completed"
                {...register("isCompleted")}
                defaultChecked={todo?.isCompleted}
              />{" "}
            </Form.Group>
            <Button
              disabled={isSubmitting}
              variant="success"
              type="submit"
              className="mt-2"
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
