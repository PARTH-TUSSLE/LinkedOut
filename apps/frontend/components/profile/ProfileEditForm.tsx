"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Card } from "@/components/ui/Card";
import { EducationForm } from "./EducationForm";
import { WorkHistoryForm } from "./WorkHistoryForm";
import { useAppDispatch } from "@/store/hooks";
import { updateProfile } from "@/store/thunks/profileThunks";
import { addToast } from "@/store/slices/uiSlice";
import type { Profile } from "@/types";

interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [education, setEducation] = useState(profile.education || []);
  const [workHistory, setWorkHistory] = useState(profile.workHistory || []);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      bio: profile.bio || "",
      occupationStatus: profile.occupationStatus || "",
      location: profile.location || "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        updateProfile({
          bio: data.bio,
          occupationStatus: data.occupationStatus,
          location: data.location,
          education: education.map((e: any) => ({
            school: e.school || "",
            degree: e.degree || "",
            fieldOfStudy: e.fieldOfStudy || "",
            startYear: e.startDate ? new Date(e.startDate).getFullYear() : null,
            endYear: e.endDate ? new Date(e.endDate).getFullYear() : null,
          })),
          workHistory: workHistory.map((w: any) => ({
            company: w.company || "",
            location: w.location || "",
            position: w.position || "",
            years: w.years || "",
            startDate: w.startDate || null,
            endDate: w.endDate || null,
            description: w.description || "",
          })),
        })
      ).unwrap();
      dispatch(addToast({ message: "Profile updated", type: "success" }));
      router.push("/profile");
    } catch (err: any) {
      dispatch(
        addToast({
          message: typeof err === "string" ? err : "Failed to update profile",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-5 space-y-4 shadow-sm">
        <h3 className="text-label text-text-tertiary">Basic Information</h3>
        <Input
          label="Occupation / Title"
          placeholder="Software Engineer at..."
          {...register("occupationStatus")}
        />
        <Input
          label="Location"
          placeholder="San Francisco, CA"
          {...register("location")}
        />
        <TextArea
          label="Bio"
          placeholder="Tell people about yourself..."
          rows={4}
          {...register("bio")}
        />
      </Card>

      <Card className="p-5 shadow-sm">
        <EducationForm data={education} onChange={setEducation} />
      </Card>

      <Card className="p-5 shadow-sm">
        <WorkHistoryForm data={workHistory} onChange={setWorkHistory} />
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          <Save size={15} />
          Save changes
        </Button>
      </div>
    </form>
  );
}
