import z from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3).max(50),
  username: z.string().min(3).max(50),
  email: z.string(),
  password: z.string().min(6)
})

export const SignInSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().optional(),
  password: z.string().min(6),
});