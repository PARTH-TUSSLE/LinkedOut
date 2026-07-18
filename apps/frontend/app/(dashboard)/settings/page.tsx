"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUserInfo } from "@/store/thunks/profileThunks";
import { setUser } from "@/store/slices/authSlice";
import { addToast } from "@/store/slices/uiSlice";

interface SettingsFormData {
  username: string;
  email: string;
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      const updatedUser = await dispatch(
        updateUserInfo({
          username: data.username,
          email: data.email,
        })
      ).unwrap();
      dispatch(setUser(updatedUser));
      dispatch(
        addToast({ message: "Settings updated", type: "success" })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          message:
            typeof err === "string" ? err : "Failed to update settings",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary">
          Manage your account settings
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username"
            placeholder="johndoe"
            error={errors.username?.message}
            {...register("username", { minLength: 3, maxLength: 50 })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" loading={isSubmitting}>
              <Save size={16} />
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
