"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { AuthField, type FieldErrors } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { updateMyProfile } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import { ProfileSchema, type ProfileFormValues } from "@/lib/profile";
import type { User } from "@/lib/types";
import { useUserStore } from "@/stores/user-store";

export function ProfileForm({ user }: { user: User }) {
  const setUser = useUserStore((state) => state.setUser);
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<keyof ProfileFormValues>
  >({});

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile", user.id],
    mutationFn: (values: ProfileFormValues) => updateMyProfile(user.id, values),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.add({
        title: "Profile updated",
        description: "Your account details are up to date.",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        title: "Profile update failed",
        description: getApiErrorMessage(error),
        type: "error",
      });
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = ProfileSchema.safeParse(
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Profile details</CardTitle>
        <CardDescription>
          Keep your name, email and sign in password current.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="profile-form" noValidate onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-3 sm:grid-cols-2">
              <AuthField
                name="firstName"
                label="First name"
                defaultValue={user.firstName}
                autoComplete="given-name"
                disabled={isPending}
                error={fieldErrors.firstName?.[0]}
              />
              <AuthField
                name="lastName"
                label="Last name"
                defaultValue={user.lastName ?? ""}
                autoComplete="family-name"
                disabled={isPending}
                error={fieldErrors.lastName?.[0]}
              />
            </div>
            <AuthField
              name="email"
              label="Email"
              type="email"
              defaultValue={user.email}
              autoComplete="email"
              disabled={true}
              error={fieldErrors.email?.[0]}
            />
            <AuthField
              name="password"
              label="New password"
              type="password"
              autoComplete="new-password"
              placeholder="Leave blank to keep your password"
              disabled={isPending}
              description="Use at least 8 characters."
              error={fieldErrors.password?.[0]}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button form="profile-form" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </CardFooter>
    </Card>
  );
}
