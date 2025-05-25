import React, { useEffect, useState } from "react";
import type { Task } from "../types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<"todo" | "inprogress" | "completed">(
    "todo"
  );

  const handleSubmit = () => {
    const task: Task = {
      id: initialTask?.id || crypto.randomUUID(),
      title,
      description,
      assignedTo,
      dueDate,
      status,
    };
    onSave(task);
    onClose();
  };

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setAssignedTo(initialTask.assignedTo || "");
      setDueDate(initialTask.dueDate || "");
      setStatus(initialTask.status);
    }
  }, [initialTask]);

  if (!isOpen) return null;

  return (
    <>
      <h2 className="text-xl font-bold mb-4">
        {initialTask ? "Edit Task" : "New Task"}
      </h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full mb-2 p-2 border rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Assigned To"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select
        className="w-full mb-4 p-2 border rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value as Task["status"])}
      >
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 rounded bg-gray-200 cursor-pointer"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white cursor-pointer"
          onClick={handleSubmit}
          disabled={title === ""}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default TaskModal;
