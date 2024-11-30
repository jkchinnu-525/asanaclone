"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AddFieldDialog } from "./dialog-box";
import type { CustomField } from "../types/field";
import { useTheme } from "./themeprovider";

function TaskHeader({
  fields,
  onAddField,
}: {
  fields: any[];
  onAddField: () => void;
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`flex border-b border-[#424244] ${
        theme === "light" ? "bg-white" : "bg-[#1E1F21]"
      }`}
    >
      {/* Fixed task name column */}
      <div
        className={`flex-none w-[400px] border-r border-[#424244] ${
          theme === "light" ? "text-gray-900" : "text-white"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <span
            className={`text-sm font-medium text-gray-100 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          >
            Task name
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          />
        </div>
      </div>

      {/* Scrollable columns */}
      <ScrollArea className="w-[calc(100%-400px)]">
        <div
          className={`flex min-w-max ${
            theme === "light" ? "bg-white" : "bg-[#1E1F21]"
          }`}
        >
          {fields.slice(1).map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between min-w-[200px] p-4 border-r border-[#424244]"
            >
              <span
                className={`text-sm font-medium text-gray-100 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                {field.name}
              </span>
            </div>
          ))}

          {/* Add field button */}
          <div className="flex items-center justify-center min-w-[52px] border-r border-[#424244]">
            <Button
              variant="ghost"
              size="icon"
              className="h-[52px] w-[52px] hover:bg-[#2C2D2E]"
              onClick={onAddField}
            >
              <Plus className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

export function TaskList() {
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [fields, setFields] = useState([
    { id: "1", name: "Task name", key: "title" },
    { id: "2", name: "Due date", key: "dueDate" },
    { id: "3", name: "Projects", key: "project" },
    { id: "4", name: "Task visibility", key: "visibility" },
  ]);

  const handleAddField = (field: CustomField) => {
    setFields([
      ...fields,
      {
        id: crypto.randomUUID(),
        name: field.name,
        key: field.name.toLowerCase().replace(/\s+/g, "_"),
      },
    ]);
    setIsAddFieldOpen(false);
  };

  return (
    <div className="grid grid-cols">
      {/* Sidebar */}
      <div className="flex-shrink-0 border-r border-[#424244] bg-[#2e2e30]">
        {/* Existing sidebar content */}
      </div>

      {/* Main content */}
      <div className="flex flex-col min-w-0">
        <TaskHeader
          fields={fields}
          onAddField={() => setIsAddFieldOpen(true)}
        />
        <div className="flex flex-col h-full overflow-hidden bg-[#1E1F21]">
          <AddFieldDialog
            open={isAddFieldOpen}
            onOpenChange={setIsAddFieldOpen}
            onAddField={handleAddField}
          />
        </div>
      </div>
    </div>
  );
}
