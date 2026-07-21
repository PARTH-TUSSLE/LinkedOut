"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppDispatch } from "@/store/hooks";
import { registerUser } from "@/store/thunks/authThunks";
import { setCredentials } from "@/store/slices/authSlice";
import { STORAGE_KEYS } from "@/config/constants";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export function SignUpForm() {
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
      const result = await dispatch(registerUser(data)).unwrap();
      localStorage.setItem(STORAGE_KEYS.TOKEN, result.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
      dispatch(setCredentials({ user: result.user, token: result.token }));
      router.push("/profile/edit");
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Something went wrong");
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
        label="Full name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Username"
        placeholder="johndoe"
        error={errors.username?.message}
        {...register("username")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="space-y-1.5">
        <label className="block text-body-sm font-medium text-text-secondary">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
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
        <UserPlus size={16} />
        Create account
      </Button>
    </form>
  );
}
