export interface Task {
    id: string;
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: string;
    status: "todo" | "inprogress" | "completed";
}