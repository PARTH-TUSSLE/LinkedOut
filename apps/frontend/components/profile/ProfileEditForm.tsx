"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { EducationForm } from "./EducationForm";
import { WorkHistoryForm } from "./WorkHistoryForm";
import { useAppDispatch } from "@/store/hooks";
import { updateProfile } from "@/store/thunks/profileThunks";
import { addToast } from "@/store/slices/uiSlice";
import type { Profile } from "@/types";

export interface ProfileEditFormData {
  bio: string;
  occupationStatus: string;
  location: string;
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    startYear?: number | null;
    endYear?: number | null;
  }>;
  workHistory: Array<{
    company: string;
    location: string;
    position: string;
    years: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

interface ProfileEditFormProps {
  profile: Profile;
  onSuccess: () => void;
}

export function ProfileEditForm({ profile, onSuccess }: ProfileEditFormProps) {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProfileEditFormData>({
    defaultValues: {
      bio: profile.bio || "",
      occupationStatus: profile.occupationStatus || "",
      location: profile.location || "",
      education: profile.education.length > 0
        ? profile.education.map((e) => ({
            school: e.school,
            degree: e.degree,
            fieldOfStudy: e.fieldOfStudy,
            startYear: e.startDate ? new Date(e.startDate).getFullYear() : null,
            endYear: e.endDate ? new Date(e.endDate).getFullYear() : null,
          }))
        : [{ school: "", degree: "", fieldOfStudy: "", startYear: null, endYear: null }],
      workHistory: profile.workHistory.length > 0
        ? profile.workHistory.map((w) => ({
            company: w.company,
            location: w.location || "",
            position: w.position,
            years: w.years,
            startDate: w.startDate ? w.startDate.split("T")[0] : "",
            endDate: w.endDate ? w.endDate.split("T")[0] : "",
            description: w.description || "",
          }))
        : [{ company: "", location: "", position: "", years: "", startDate: "", endDate: "", description: "" }],
    },
  });

  const educationFields = watch("education");
  const workHistoryFields = watch("workHistory");

  const addEducation = () => {
    setValue("education", [
      ...educationFields,
      { school: "", degree: "", fieldOfStudy: "", startYear: null, endYear: null },
    ]);
  };

  const removeEducation = (index: number) => {
    setValue(
      "education",
      educationFields.filter((_, i) => i !== index)
    );
  };

  const addWorkHistory = () => {
    setValue("workHistory", [
      ...workHistoryFields,
      { company: "", location: "", position: "", years: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeWorkHistory = (index: number) => {
    setValue(
      "workHistory",
      workHistoryFields.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: ProfileEditFormData) => {
    try {
      await dispatch(
        updateProfile(data)
      ).unwrap();

      dispatch(addToast({ message: "Profile updated", type: "success" }));
      onSuccess();
    } catch (err: any) {
      dispatch(
        addToast({
          message: typeof err === "string" ? err : "Failed to update profile",
          type: "error",
        })
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-text-primary">
          Profile details
        </h2>
        <TextArea
          label="Bio"
          placeholder="Tell us about yourself"
          rows={3}
          error={errors.bio?.message}
          {...register("bio")}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Occupation"
            placeholder="Software Engineer"
            error={errors.occupationStatus?.message}
            {...register("occupationStatus")}
          />
          <Input
            label="Location"
            placeholder="San Francisco, CA"
            error={errors.location?.message}
            {...register("location")}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">
            Education
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={addEducation}>
            <Plus size={16} />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {educationFields.map((_, index) => (
            <EducationForm
              key={index}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => removeEducation(index)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">
            Work experience
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={addWorkHistory}>
            <Plus size={16} />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {workHistoryFields.map((_, index) => (
            <WorkHistoryForm
              key={index}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => removeWorkHistory(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting}>
          <Save size={16} />
          Save changes
        </Button>
      </div>
    </form>
  );
}
