import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import type { AppDispatch, RootState } from "../app/store";
import {
  createTodoAsync,
  createTodoAsync2,
  setIsAddTodoModalOpen,
} from "../features/todoSlice";
import { Button } from "react-bootstrap";
import type { PageClickEvent, AddTodoRequest } from "../types";
import { fetchTodosAsync } from "../api/todosApi";
import TodosTable from "../components/TodosTable";
import AddTodoModal from "../components/AddTodoModal";

export default function TodosPage() {
  const itemsPerPage = 10;
  const [itemOffset, setItemOffset] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const isAddTodoModalOpen = useSelector(
    (state: RootState) => state.todo.value.isAddTodoModalOpen,
  );

  const handlePageClick = (event: PageClickEvent): void => {
    const newOffset = (event.selected * itemsPerPage) % dataRows.length;
    setItemOffset(newOffset);
  };

  const {
    data: responseData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["todos", itemOffset],
    queryFn: () => fetchTodosAsync(itemOffset),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const dataRows = useMemo(() => {
    if (responseData) {
      return responseData.value.todos;
    }
    return [];
  }, [responseData]);

  const pageCount = Math.ceil(
    (responseData?.value.totalCount || 0) / itemsPerPage,
  );

  const handleAddTodo = async (data: AddTodoRequest) => {
    await dispatch(createTodoAsync2(data));
    refetch();
  };

  return (
    <>
      <div className="container mt-4" style={{ marginTop: 100 }}>
        <h2 className="mb-4">Todos</h2>
        <Button
          variant="primary"
          onClick={() => dispatch(setIsAddTodoModalOpen(true))}
        >
          Add Todo
        </Button>

        <TodosTable
          pageCount={pageCount}
          pageSize={itemsPerPage}
          isLoading={isFetching}
          todosData={dataRows}
          handlePageClick={handlePageClick}
        />
      </div>

      <AddTodoModal
        isOpen={isAddTodoModalOpen}
        onClose={() => dispatch(setIsAddTodoModalOpen(false))}
        onSubmit={handleAddTodo}
      />
    </>
  );
}
