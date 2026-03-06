import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../app/store";
import { getTodoAsync } from "../features/todoSlice";
import type { RootState } from "../app/store";
import { Link, useParams } from "react-router-dom";

export default function TodoPage() {
  const params = useParams() as { id: string };
  const todo = useSelector((state: RootState) => state.todo.value.todo);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getTodoAsync(params.id));
  }, [dispatch, params.id]);

  if (!todo) {
    return (
      <div className="container mt-4" style={{ marginTop: 100 }}>
        <h2 className="mb-4">Todo details</h2>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4" style={{ marginTop: 100 }}>
        <h2 className="mb-4">Todo details</h2>
        <table className="table">
          <tbody>
            <tr>
              <th>Title</th>
              <td>{todo.title}</td>
            </tr>
            <tr>
              <th>Completed</th>
              <td>{todo.isCompleted ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <th>Date Created</th>
              <td>
                {todo.createdAt
                  ? new Date(todo.createdAt).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
        <Link to="/todos" className="btn btn-secondary mt-3">
          &larr; Back to Todos
        </Link>
      </div>
    </>
  );
}
