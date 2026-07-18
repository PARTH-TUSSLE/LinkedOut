"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/store/hooks";
import { registerUser } from "@/store/thunks/authThunks";
import { setLoading } from "@/store/slices/authSlice";
import { addToast } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50),
    username: z.string().min(3, "Username must be at least 3 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function SignUpForm() {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      await dispatch(
        registerUser({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        })
      ).unwrap();

      window.location.href = "/dashboard";
    } catch (error: any) {
      dispatch(
        addToast({
          message: typeof error === "string" ? error : "Sign up failed",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="name"
        label="Full name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        id="username"
        label="Username"
        placeholder="johndoe"
        error={errors.username?.message}
        {...register("username")}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        id="confirmPassword"
        label="Confirm password"
        type="password"
        placeholder="Repeat your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Create account
      </Button>
    </form>
  );
}
