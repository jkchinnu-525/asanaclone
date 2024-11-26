"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronRight,
  Grid,
  GripVertical,
  Home,
  Inbox,
  List,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

interface Section {
  id: string;
  title: string;
  isExpanded: boolean;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  collaborators: Collaborator[];
  project: string;
  isPrivate: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
}

const collaborators: Collaborator[] = [
  { id: "1", name: "Krishna", avatar: "/placeholder-user.jpg" },
  { id: "2", name: "Bob Wilson", avatar: "/placeholder-user.jpg" },
  { id: "3", name: "Charlie Davis", avatar: "/placeholder-user.jpg" },
];

const projects = ["Marketing", "Development", "Design"];

function SortableTask({
  task,
  onUpdate,
}: {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="grid grid-cols-[24px_1fr_150px_150px_150px_100px] items-center gap-4 py-2 text-sm text-[#9CA6AF] hover:bg-[#2C2D2E]"
    >
      <Checkbox id={`task-${task.id}`} className="h-4 w-4" />
      <label htmlFor={`task-${task.id}`} className="text-white cursor-pointer">
        {task.title}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-[150px] justify-start p-0 text-[#9CA6AF] hover:text-white hover:bg-[#1e1f21]"
          >
            {task.dueDate ? task.dueDate.toLocaleDateString() : "No date"}
            <Calendar className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={task.dueDate || undefined}
            onSelect={(date) => onUpdate({ ...task, dueDate: date || null })}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-[150px] justify-start p-0 text-[#9CA6AF] hover:text-white hover:bg-[#1e1f21]"
          >
            {task.collaborators.length > 0 ? (
              <div className="flex -space-x-2">
                {task.collaborators.map((collaborator) => (
                  <Avatar
                    key={collaborator.id}
                    className="h-6 w-6 border-2 border-[#1E1F21]"
                  >
                    <AvatarImage
                      alt={collaborator.name}
                      src={collaborator.avatar}
                    />
                    <AvatarFallback>
                      {collaborator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <span>Unassigned</span>
            )}
            <Users className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search collaborators..." />
            <CommandEmpty>No collaborators found.</CommandEmpty>
            <CommandGroup>
              {collaborators.map((collaborator) => (
                <CommandItem
                  key={collaborator.id}
                  onSelect={() => {
                    const updatedCollaborators = task.collaborators.some(
                      (c) => c.id === collaborator.id,
                    )
                      ? task.collaborators.filter(
                          (c) => c.id !== collaborator.id,
                        )
                      : [...task.collaborators, collaborator];
                    onUpdate({ ...task, collaborators: updatedCollaborators });
                  }}
                >
                  <Checkbox
                    checked={task.collaborators.some(
                      (c) => c.id === collaborator.id,
                    )}
                    className="mr-2 h-4 w-4"
                  />
                  {collaborator.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-[150px] justify-start p-0 text-[#9CA6AF] hover:text-white hover:bg-[#1e1f21]"
          >
            {task.project || "No project"}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search projects..." />
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {projects.map((project) => (
                <CommandItem
                  key={project}
                  onSelect={() => onUpdate({ ...task, project })}
                >
                  {project}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onUpdate({ ...task, isPrivate: !task.isPrivate })}
        className="w-[100px] justify-start p-0 text-[#9CA6AF] hover:text-white hover:bg-[#1e1f21]"
      >
        {task.isPrivate ? "Only me" : "Public"}
      </Button>
    </div>
  );
}

function SortableSection({
  section,
  onDelete,
  onUpdateTasks,
}: {
  section: Section;
  onDelete: (id: string) => void;
  onUpdateTasks: (sectionId: string, tasks: Task[]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [isAddingTask, setIsAddingTask] = React.useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskTitle.trim()) {
      const newTask: Task = {
        id: String(Date.now()),
        title: newTaskTitle,
        dueDate: null,
        collaborators: [],
        project: "",
        isPrivate: false,
      };
      onUpdateTasks(section.id, [...section.tasks, newTask]);
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = section.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    onUpdateTasks(section.id, updatedTasks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = section.tasks.findIndex((task) => task.id === active.id);
      const newIndex = section.tasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(section.tasks, oldIndex, newIndex);
      onUpdateTasks(section.id, newTasks);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="group mb-4">
      <div className="flex items-center gap-2 text-[#9CA6AF] mb-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          className="flex items-center gap-2"
          onClick={() => {
            section.isExpanded = !section.isExpanded;
          }}
        >
          {section.isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          {section.title}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-gray-200"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black">
            <DropdownMenuItem
              onSelect={() => onDelete(section.id)}
              className="text-white"
            >
              Delete section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {section.isExpanded && (
        <div className="pl-6">
          <DndContext
            sensors={[useSensor(PointerSensor)]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={section.tasks}
              strategy={verticalListSortingStrategy}
            >
              {section.tasks.map((task) => (
                <SortableTask
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingTask ? (
            <div className="grid grid-cols-[24px_1fr_150px_150px_150px_100px] items-center gap-4 py-2 text-sm">
              <Checkbox className="h-4 w-4" />
              <Input
                autoFocus
                placeholder="Write a task name"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleAddTask}
                className="h-8 bg-transparent border-none text-white placeholder:text-[#9CA6AF] focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
            </div>
          ) : (
            <button
              className="flex items-center gap-2 text-[#9CA6AF] hover:text-white transition-colors py-2"
              onClick={() => setIsAddingTask(true)}
            >
              <Plus className="h-4 w-4" />
              Add task
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [sections, setSections] = React.useState<Section[]>([]);
  const [isAddingSection, setIsAddingSection] = React.useState(false);
  const [newSectionTitle, setNewSectionTitle] = React.useState("");
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((sections) => {
        const oldIndex = sections.findIndex(
          (section) => section.id === active.id,
        );
        const newIndex = sections.findIndex(
          (section) => section.id === over.id,
        );

        return arrayMove(sections, oldIndex, newIndex);
      });
    }
  }

  const handleDeleteSection = (sectionId: string) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  const handleUpdateTasks = (sectionId: string, tasks: Task[]) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, tasks } : section,
      ),
    );
  };

  const handleSectionSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSectionTitle.trim()) {
      addNewSection();
    }
  };

  const handleSectionBlur = () => {
    if (newSectionTitle.trim()) {
      addNewSection();
    }
  };

  const addNewSection = () => {
    setSections([
      ...sections,
      {
        id: String(Date.now()),
        title: newSectionTitle,
        isExpanded: true,
        tasks: [],
      },
    ]);
    setNewSectionTitle("");
    setIsAddingSection(false);
  };

  const handleSignIn = () => {
    router.push("/signin");
  }

  return (
    <div className="flex h-screen bg-[#1E1F21]">
      <div className="hidden w-64 border-r border-[#424244] bg-[#2e2e30] lg:block">
        <div className="flex h-14 items-center border-b border-[#424244] px-4">
          <Link
            className="flex items-center gap-2 font-semibold text-white"
            href="#"
          >
            <Grid className="h-6 w-6" />
            <span>TaskFlow</span>
          </Link>
        </div>
        <div className="flex flex-col gap-1 p-4">
          <Button className="justify-start text-gray-100" variant="ghost">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button className="justify-start text-gray-100" variant="ghost">
            <List className="mr-2 h-4 w-4" />
            My Tasks
          </Button>
          <Button className="justify-start text-gray-100" variant="ghost">
            <Inbox className="mr-2 h-4 w-4" />
            Inbox
          </Button>
          <Separator className="my-2 bg-[#424244]" />
          <div className="flex items-center justify-between px-2 py-1 text-sm font-semibold text-gray-100">
            Projects
            <Button size="icon" variant="ghost" className="text-[#9CA6AF]">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button className="justify-start text-gray-100" variant="ghost">
            <span className="mr-2 h-2 w-2 rounded-full bg-blue-600" />
            Marketing
          </Button>
          <Button className="justify-start text-gray-100" variant="ghost">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-600" />
            Development
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-[#424244] px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5 text-[#9CA6AF]" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage alt="User" src="/placeholder-user.jpg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-white">My tasks</span>
            <ChevronDown className="h-4 w-4 text-[#9CA6AF]" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-[#9CA6AF]">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#9CA6AF]">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#9CA6AF]"
            onClick={handleSignIn}
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </header>
        {/* <div className="flex items-center gap-4 border-b border-[#424244] px-4 py-2">
          <Button variant="ghost" className="text-[#9CA6AF]">
            List
          </Button>
          <Button variant="ghost" className="text-[#9CA6AF]">
            Board
          </Button>
          <Button variant="ghost" className="text-[#9CA6AF]">
            Calendar
          </Button>
          <Button variant="ghost" className="text-[#9CA6AF]">
            Files
          </Button>
          <Plus className="h-4 w-4 text-[#9CA6AF]" />
        </div> */}
        <div className="flex items-center gap-4 border-b border-[#424244] p-4">
          {/* <Button className="bg-[#4573D2] text-white hover:bg-[#4573D2]/90">
            Add task
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button> */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" className="text-[#9CA6AF]">
              Filter
            </Button>
            <Button variant="ghost" className="text-[#9CA6AF]">
              Sort
            </Button>
            <Button variant="ghost" className="text-[#9CA6AF]">
              Group
            </Button>
            <Button variant="ghost" className="text-[#9CA6AF]">
              Options
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-[24px_1fr_150px_150px_150px_100px] gap-4 border-b border-[#424244] p-4 text-sm text-gray-100">
          <div></div>
          <div>Task name</div>
          <div>Due date</div>
          <div>Collaborators</div>
          <div>Projects</div>
          <div>Task visibility</div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onDelete={handleDeleteSection}
                    onUpdateTasks={handleUpdateTasks}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {isAddingSection ? (
              <div className="pl-6">
                <Input
                  autoFocus
                  className="h-8 w-64 bg-transparent border-none text-white placeholder:text-[#9CA6AF] focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Section name"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  onKeyDown={handleSectionSubmit}
                  onBlur={handleSectionBlur}
                />
              </div>
            ) : (
              <button
                className="flex items-center gap-2 pl-6 text-[#9CA6AF] hover:text-white transition-colors"
                onClick={() => setIsAddingSection(true)}
              >
                <Plus className="h-4 w-4" />
                Add section
              </button>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
