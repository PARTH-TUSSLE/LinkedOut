"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ProfileEditFormData } from "./ProfileEditForm";

interface EducationFormProps {
  index: number;
  register: UseFormRegister<ProfileEditFormData>;
  errors: FieldErrors<ProfileEditFormData>;
  onRemove: () => void;
}

export function EducationForm({
  index,
  register,
  errors,
  onRemove,
}: EducationFormProps) {
  const eduErrors = errors.education?.[index];

  return (
    <div className="relative rounded-lg border border-border p-4">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 rounded p-1 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 size={16} />
      </button>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="School"
          placeholder="University name"
          error={eduErrors?.school?.message}
          {...register(`education.${index}.school`)}
        />
        <Input
          label="Degree"
          placeholder="Bachelor's, Master's..."
          error={eduErrors?.degree?.message}
          {...register(`education.${index}.degree`)}
        />
        <Input
          label="Field of study"
          placeholder="Computer Science"
          error={eduErrors?.fieldOfStudy?.message}
          {...register(`education.${index}.fieldOfStudy`)}
        />
        <div className="flex gap-2">
          <Input
            label="Start year"
            type="number"
            placeholder="2020"
            error={eduErrors?.startYear?.message}
            {...register(`education.${index}.startYear`, { valueAsNumber: true })}
          />
          <Input
            label="End year"
            type="number"
            placeholder="2024"
            error={eduErrors?.endYear?.message}
            {...register(`education.${index}.endYear`, { valueAsNumber: true })}
          />
        </div>
      </div>
    </div>
  );
}
