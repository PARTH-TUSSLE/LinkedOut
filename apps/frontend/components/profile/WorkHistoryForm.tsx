"use client";

import { Plus, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";

interface WorkItem {
  id?: number;
  company: string;
  position: string;
  location?: string;
  years: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string;
}

interface WorkHistoryFormProps {
  data: WorkItem[];
  onChange: (data: WorkItem[]) => void;
}

export function WorkHistoryForm({ data, onChange }: WorkHistoryFormProps) {
  const items = data;

  const updateItem = (index: number, field: keyof WorkItem, value: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...items, { company: "", position: "", location: "", years: "", description: "", startDate: "", endDate: "" }]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-tertiary">Work History</h3>
        <Button type="button" variant="ghost" size="sm" onClick={handleAdd}>
          <Plus size={14} />
          Add
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-body-sm text-text-tertiary py-2">No work history added yet.</p>
      )}

      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-body-sm font-medium text-text-secondary">
              <Briefcase size={14} />
              Position {index + 1}
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-text-tertiary hover:text-danger transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Company"
              placeholder="Google"
              value={item.company}
              onChange={(e) => updateItem(index, "company", e.target.value)}
            />
            <Input
              label="Position"
              placeholder="Software Engineer"
              value={item.position}
              onChange={(e) => updateItem(index, "position", e.target.value)}
            />
            <Input
              label="Start date"
              type="date"
              value={item.startDate || ""}
              onChange={(e) => updateItem(index, "startDate", e.target.value)}
            />
            <Input
              label="End date"
              type="date"
              value={item.endDate || ""}
              onChange={(e) => updateItem(index, "endDate", e.target.value)}
            />
          </div>
          <TextArea
            label="Description"
            placeholder="Describe your role and achievements..."
            rows={3}
            value={item.description || ""}
            onChange={(e) => updateItem(index, "description", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
