import React, { useEffect, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { supabase } from "../utils/supabaseClient";
import { Button, Modal } from "antd";

import type { Task } from "../types";
import Column from "./Column";
import TaskCard from "./TaskCard";
import AnimeModal from "./TaskModal";
import { PlusOutlined } from "@ant-design/icons";

const Board: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenNew = () => {
    setActiveTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setActiveTask(task);
    setModalOpen(true);
  };

  const handleSave = async (task: Task) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (task.id && tasks.some((t) => t.id === task.id)) {
      await supabase.from("tasks").update(task).eq("id", task.id);
    } else {
      await supabase.from("tasks").insert({
        ...task,
        user_id: user?.id,
      });
    }

    // Refresh tasks from Supabase
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("createdAt");
    setTasks(data as Task[]);
  };

  const handleDelete = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) console.error("Delete error:", error);
    else {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("createdAt");
      setTasks(data as Task[]);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const taskId = active.id;
    const newStatus = over.id as Task["status"];

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) console.error("Supabase update failed:", error.message);
  };

  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "inprogress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user?.id)
        .order("createdAt");

      if (error)
        console.error("Fetch error:", console.error("Fetch error:", error));
      else setTasks(data as Task[]);
      setLoading(false);
    };

    fetchTasks();
  }, []);

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-end">
        <Button
          type="primary"
          size="large"
          variant="solid"
          color="purple"
          shape="default"
          onClick={handleOpenNew}
          icon={<PlusOutlined />}
        >
          New Task
        </Button>
      </div>
      <div className="p-4 sm:p-6 flex gap-4 sm:gap-6 overflow-x-auto h-full">
        <div className="flex min-w-[768px] sm:min-w-full gap-4 sm:gap-6 sm:justify-center">
          <Column
            key={"todo"}
            id={"todo"}
            title="To Do"
            tasks={columns.todo}
            onTaskClick={handleEdit}
            OnTaskDelete={handleDelete}
          />
          <Column
            key={"inprogress"}
            id={"inprogress"}
            title="In Progress"
            tasks={columns.inprogress}
            onTaskClick={handleEdit}
            OnTaskDelete={handleDelete}
          />
          <Column
            key={"completed"}
            id={"completed"}
            title="Completed"
            tasks={columns.completed}
            onTaskClick={handleEdit}
            OnTaskDelete={handleDelete}
          />
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>

      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <AnimeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialTask={activeTask}
        />
      </Modal>
    </DndContext>
  );
};

export default Board;
