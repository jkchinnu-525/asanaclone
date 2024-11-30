export interface CustomField {
  id: string;
  name: string;
  type: "text" | "date" | "user" | "project";
}

export interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  collaborators: string[];
  project: string;
  customFields: Record<string, any>;
}
