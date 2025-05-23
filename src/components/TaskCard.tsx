import { useDraggable } from "@dnd-kit/core";
import { Popconfirm } from "antd";

import type { Task } from "../types";

// icons
import { HiMiniPencilSquare } from "react-icons/hi2";
import { HiTrash } from "react-icons/hi2";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
  isOverlay?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isOverlay,
  onClick,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px. ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-xl shadow p-4 mb-4 relative ${
        isOverlay ? "opacity-80" : ""
      }`}
    >
      <section className="mt-2 absolute right-0">
        <button type="button" onClick={onClick} className="cursor-pointer">
          <HiMiniPencilSquare />
        </button>

        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={onDelete}
          okText="Yes"
          cancelText="No"
        >
          <button type="button" className="text-red-500 mx-2 cursor-pointer">
            <HiTrash />
          </button>
        </Popconfirm>
      </section>
      <div {...listeners} {...attributes} style={style}>
        <h3 className="font-semibold text-lg">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600">{task.description}</p>
        )}
        <div className="text-xs mt-2 text-gray-500">
          {task.assignedTo && <>Assigned: {task.assignedTo} • </>}
          {task.dueDate && <>Due: {task.dueDate}</>}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
