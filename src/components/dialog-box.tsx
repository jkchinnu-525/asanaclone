"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CustomField } from "../types/field";

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddField: (field: CustomField) => void;
}

export function AddFieldDialog({
  open,
  onOpenChange,
  onAddField,
}: AddFieldDialogProps) {
  const [fieldName, setFieldName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldName.trim()) {
      onAddField({
        id: crypto.randomUUID(),
        name: fieldName,
        type: "text",
      });
      setFieldName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Field</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fieldName" className="text-sm font-medium">
              Field Name
            </label>
            <Input
              id="fieldName"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Enter field name"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create Field</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
