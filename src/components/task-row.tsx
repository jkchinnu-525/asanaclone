"use client";

import { Task, CustomField } from "../types/field";

interface TaskRowProps {
  task: Task;
  customFields: CustomField[];
}

export function TaskRow({ task, customFields }: TaskRowProps) {
  return (
    <div className="flex w-max min-w-full items-center">
      <div className="w-[200px] p-4">{task.title}</div>
      <div className="w-[150px] p-4">{task.dueDate?.toLocaleDateString()}</div>
      <div className="w-[150px] p-4">{task.collaborators.join(", ")}</div>
      <div className="w-[150px] p-4">{task.project}</div>

      {customFields.map((field) => (
        <div key={field.id} className="w-[150px] p-4">
          {task.customFields[field.id] || "-"}
        </div>
      ))}
    </div>
  );
}
