"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { SigninSchema, type SigninSchemaType } from "@/lib/types";
import { getSelf, logout, signin } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import { toast } from "@/components/ui/toast";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import {
  AuthField,
  getFieldError,
  type FieldErrors,
} from "@/components/auth/auth-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { useUserStore } from "@/stores/user-store";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearUser, setUser } = useUserStore();

  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<keyof SigninSchemaType>
  >({});

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false, // prevent fetching the user when the component mounts
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: (values: SigninSchemaType) => signin(values),
    onSuccess: async () => {
      const { data: userData } = await refetch();

      if (!userData) {
        clearUser();

        try {
          await logout();
        } catch {
          // Access is still denied locally if the session revoke request fails.
        }

        toast.add({
          title: "Access denied",
          description: "We could not load your customer account.",
          type: "error",
        });
        return;
      }

      setUser(userData);

      toast.add({
        title: "Signed in successfully",
        description: "Welcome back",
        type: "success",
      });
      router.replace(safeNextPath(searchParams.get("next")));
    },
    onError: (error) => {
      toast.add({
        title: "Failed to sign in",
        description: getApiErrorMessage(error),
        type: "error",
      });
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = SigninSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget)),
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
      className={cn("flex flex-col gap-3", className)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <AuthField
          name="email"
          label="Email"
          type="email"
          placeholder="m@example.com"
          autoComplete="email"
          disabled={isPending}
          error={getFieldError(fieldErrors, "email")}
        />
        <AuthField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          disabled={isPending}
          error={getFieldError(fieldErrors, "password")}
          labelAction={
            <Link
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          }
        />
        <Field>
          <AuthSubmitButton isPending={isPending} pendingLabel="Signing in...">
            Login
          </AuthSubmitButton>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
