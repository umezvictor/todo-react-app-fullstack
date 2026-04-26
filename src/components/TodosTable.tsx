import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import type { PageClickEvent } from "../types";

interface TodosTableProps {
  pageSize: number;
  pageCount: number;
  isLoading: boolean;
  todosData: any[];
  handlePageClick: (event: PageClickEvent) => void;
}

const TodosTable: React.FC<TodosTableProps> = ({
  pageSize,
  pageCount,
  isLoading,
  todosData,
  handlePageClick,
}) => {
  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                {/* <th>Id</th> */}
                <th>Todo Item</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todosData &&
                todosData.length > 0 &&
                todosData.map((todo) => (
                  <tr key={todo.todoItemId}>
                    <td>{todo.title}</td>
                    <td>
                      <Link
                        to={`/todos/${todo.todoItemId}`}
                        className="btn btn-link text-primary"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>
                      <button className="btn btn-link text-warning">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-link text-danger">
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
            pageRangeDisplayed={pageSize}
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
        </>
      )}
    </>
  );
};

export default TodosTable;
