import { z } from "zod";

export const SignupSchema = z
  .object({
    firstName: z.string().trim().min(1, { message: "First name is required" }),
    lastName: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || undefined),
    email: z.string().trim().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type SignupRequest = Omit<SignupSchemaType, "confirmPassword">;

export function toSignupRequest({
  firstName,
  lastName,
  email,
  password,
}: SignupSchemaType): SignupRequest {
  return { firstName, lastName, email, password };
}

export const SigninSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type SigninSchemaType = z.infer<typeof SigninSchema>;

export interface User {
  id: string;
  tenantId: string | null;
  firstName: string;
  lastName?: string;
  email: string;
  role: "admin" | "staff" | "customer";
  isActive: boolean;
}