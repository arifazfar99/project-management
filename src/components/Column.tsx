import React from "react";
import { useDroppable } from "@dnd-kit/core";

import type { Task } from "../types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  OnTaskDelete: (taskId: Task["id"]) => void;
}

const Column: React.FC<ColumnProps> = ({
  id,
  title,
  tasks,
  onTaskClick,
  OnTaskDelete,
}) => {
  const { setNodeRef } = useDroppable({ id });

  const baseStyle = "rounded-xl w-64 sm:w-100 p-4 min-h-[600px] flex-shrink-0";

  let colorStyle = "bg-slate-100 text-slate-700 border border-slate-300 ";
  if (id === "inprogress") {
    colorStyle = "bg-sky-100 text-sky-700 border border-sky-300 ";
  }
  if (id === "completed") {
    colorStyle = "bg-emerald-100 text-emerald-700 border border-emerald-300 ";
  }

  return (
    <div ref={setNodeRef} className={`${baseStyle} ${colorStyle}`}>
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
      <div className="flex-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onDelete={() => OnTaskDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
