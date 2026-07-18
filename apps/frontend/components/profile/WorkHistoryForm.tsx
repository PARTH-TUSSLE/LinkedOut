"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ProfileEditFormData } from "./ProfileEditForm";

interface WorkHistoryFormProps {
  index: number;
  register: UseFormRegister<ProfileEditFormData>;
  errors: FieldErrors<ProfileEditFormData>;
  onRemove: () => void;
}

export function WorkHistoryForm({
  index,
  register,
  errors,
  onRemove,
}: WorkHistoryFormProps) {
  const workErrors = errors.workHistory?.[index];

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
          label="Company"
          placeholder="Company name"
          error={workErrors?.company?.message}
          {...register(`workHistory.${index}.company`)}
        />
        <Input
          label="Position"
          placeholder="Software Engineer"
          error={workErrors?.position?.message}
          {...register(`workHistory.${index}.position`)}
        />
        <Input
          label="Location"
          placeholder="San Francisco, CA"
          error={workErrors?.location?.message}
          {...register(`workHistory.${index}.location`)}
        />
        <Input
          label="Years"
          placeholder="2 years"
          error={workErrors?.years?.message}
          {...register(`workHistory.${index}.years`)}
        />
        <Input
          label="Start date"
          type="date"
          error={workErrors?.startDate?.message}
          {...register(`workHistory.${index}.startDate`)}
        />
        <Input
          label="End date"
          type="date"
          error={workErrors?.endDate?.message}
          {...register(`workHistory.${index}.endDate`)}
        />
        <div className="sm:col-span-2">
          <TextArea
            label="Description"
            placeholder="Describe your role and achievements"
            rows={3}
            error={workErrors?.description?.message}
            {...register(`workHistory.${index}.description`)}
          />
        </div>
      </div>
    </div>
  );
}
