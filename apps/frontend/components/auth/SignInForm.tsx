"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/thunks/authThunks";
import { setLoading } from "@/store/slices/authSlice";
import { addToast } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  username: z.string().min(3).max(50).optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export function SignInForm() {
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
        loginUser({
          username: data.username || undefined,
          email: data.email || undefined,
          password: data.password,
        })
      ).unwrap();

      window.location.href = "/dashboard";
    } catch (error: any) {
      dispatch(
        addToast({
          message: typeof error === "string" ? error : "Sign in failed",
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
        id="username"
        label="Username"
        placeholder="Enter your username"
        error={errors.username?.message}
        {...register("username")}
      />
      <Input
        id="email"
        label="Email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
