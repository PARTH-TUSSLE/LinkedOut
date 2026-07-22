"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl p-4 sm:p-6"
    >
      <div className="mb-8">
        <h1 className="text-h3 text-text-primary">Settings</h1>
        <p className="mt-1 text-body-sm text-text-secondary">
          Manage your account settings
        </p>
      </div>

      <Card className="p-5 shadow-md">
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
              <Save size={15} />
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
