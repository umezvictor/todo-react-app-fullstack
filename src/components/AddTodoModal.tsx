import React, { useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AddTodoRequest } from "../types";

const addTodoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
});

type AddTodoFormValues = z.infer<typeof addTodoSchema>;

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddTodoRequest) => Promise<void> | void;
  initialValues?: Partial<AddTodoRequest>; // optional, makes it reusable for edit later too
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTodoFormValues>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
    },
    mode: "onSubmit",
  });

  // Reset the form each time the modal opens (or when initialValues change)
  useEffect(() => {
    if (isOpen) {
      reset({ title: initialValues?.title ?? "" });
    }
  }, [isOpen, initialValues, reset]);

  const submitHandler: SubmitHandler<AddTodoFormValues> = async (values) => {
    await onSubmit(values); // values matches AddTodoRequest if it has { title: string }
    onClose();
    reset({ title: "" });
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Todo</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(submitHandler)}>
        <Modal.Body>
          <Form.Group controlId="todoTitle">
            <Form.Label>Todo Item</Form.Label>
            <Form.Control
              {...register("title")}
              type="text"
              placeholder="Enter todo item"
              isInvalid={!!errors.title}
              disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {errors.root && (
            <div className="text-danger mt-2">{errors.root.message}</div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddTodoModal;
