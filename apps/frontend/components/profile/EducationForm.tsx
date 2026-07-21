"use client";

import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface EducationItem {
  id?: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate?: string | null;
  endDate?: string | null;
}

interface EducationFormProps {
  data: EducationItem[];
  onChange: (data: EducationItem[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const items = data;

  const updateItem = (index: number, field: keyof EducationItem, value: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...items, { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" }]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-tertiary">Education</h3>
        <Button type="button" variant="ghost" size="sm" onClick={handleAdd}>
          <Plus size={14} />
          Add
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-body-sm text-text-tertiary py-2">No education added yet.</p>
      )}

      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-body-sm font-medium text-text-secondary">
              <GraduationCap size={14} />
              Education {index + 1}
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
              label="School"
              placeholder="MIT"
              value={item.school}
              onChange={(e) => updateItem(index, "school", e.target.value)}
            />
            <Input
              label="Degree"
              placeholder="Bachelor's"
              value={item.degree}
              onChange={(e) => updateItem(index, "degree", e.target.value)}
            />
            <Input
              label="Field of study"
              placeholder="Computer Science"
              value={item.fieldOfStudy}
              onChange={(e) => updateItem(index, "fieldOfStudy", e.target.value)}
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
        </div>
      ))}
    </div>
  );
}
