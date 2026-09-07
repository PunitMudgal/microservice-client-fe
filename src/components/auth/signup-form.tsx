"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  SignupSchema,
  toSignupRequest,
  type SignupSchemaType,
} from "@/lib/types";
import { signup, NESTA_TENANT_ID } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import { toast } from "@/components/ui/toast";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import {
  AuthField,
  getFieldError,
  type FieldErrors,
} from "@/components/auth/auth-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<keyof SignupSchemaType>
  >({});

  const { mutate, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: (values: SignupSchemaType) => signup({ ...toSignupRequest(values), tenantId: NESTA_TENANT_ID }),
    onSuccess: () => {
      toast.add({
        title: "Account created successfully",
        description: "You can now login to your account",
        type: "success",
      });
      router.replace("/sign-in");
    },
    onError: (error) => {
      toast.add({
        title: "Failed to create account",
        description: getApiErrorMessage(error),
        type: "error",
      });
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = SignupSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget))
    );

    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setFieldErrors({});
    mutate(parsed.data);
  }

  return (
    <form
      {...props}
      noValidate
      aria-busy={isPending}
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-1", className)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <div className="grid gap-7 sm:grid-cols-2">
          <AuthField
            name="firstName"
            label="First name"
            placeholder="John"
            autoComplete="given-name"
            disabled={isPending}
            error={getFieldError(fieldErrors, "firstName")}
          />
          <AuthField
            name="lastName"
            label="Last name"
            placeholder="Doe"
            autoComplete="family-name"
            disabled={isPending}
            error={getFieldError(fieldErrors, "lastName")}
          />
        </div>
        <AuthField
          name="email"
          label="Email"
          type="email"
          placeholder="m@example.com"
          autoComplete="email"
          disabled={isPending}
          error={getFieldError(fieldErrors, "email")}
          description="We'll use this to contact you. We will not share your email with anyone else."
        />
        <AuthField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          disabled={isPending}
          error={getFieldError(fieldErrors, "password")}
          description="Must be at least 8 characters long."
        />
        <AuthField
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          disabled={isPending}
          error={getFieldError(fieldErrors, "confirmPassword")}
          description="Please confirm your password."
        />
        <Field>
          <AuthSubmitButton isPending={isPending} pendingLabel="Creating account...">
            Create Account
          </AuthSubmitButton>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
