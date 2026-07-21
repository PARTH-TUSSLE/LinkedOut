"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/thunks/authThunks";
import { setCredentials } from "@/store/slices/authSlice";
import { STORAGE_KEYS } from "@/config/constants";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      dispatch(setCredentials({ user: result.user, token: result.token }));
      router.push("/dashboard");
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-border-danger bg-danger-subtle px-3 py-2 text-body-sm text-danger">
          {error}
        </div>
      )}

      <Input
        label="Username"
        placeholder="Enter your username"
        error={errors.username?.message}
        {...register("username")}
      />

      <div className="space-y-1.5">
        <label className="block text-body-sm font-medium text-text-secondary">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="h-9 w-full rounded-lg border border-border bg-card pl-3 pr-9 text-body-sm text-text-primary placeholder:text-text-tertiary transition-all duration-150 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-ring hover:border-border-hover"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password?.message && (
          <p className="text-caption text-danger">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        <LogIn size={16} />
        Sign in
      </Button>
    </form>
  );
}
