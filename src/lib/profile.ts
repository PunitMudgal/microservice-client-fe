import { z } from "zod";

export const ADDRESS_LABELS = ["home", "work", "other"] as const;

export type AddressLabel = (typeof ADDRESS_LABELS)[number];

export interface Address {
  id: string;
  userId: string;
  label: AddressLabel;
  customLabel?: string | null;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  receiverName?: string | null;
  receiverPhone: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  label: AddressLabel;
  customLabel?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  receiverName?: string;
  receiverPhone: string;
  isPrimary?: boolean;
}

export type UpdateAddressInput = Partial<CreateAddressInput> & {
  isActive?: boolean;
};

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .refine((value) => /^\+?[1-9]\d{7,14}$/.test(value), {
    message: "Enter a valid phone number",
  });

export const ProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" }),
  lastName: optionalText(100),
  email: z.string().trim().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => !value || value.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;

export const AddressSchema = z
  .object({
    label: z.enum(ADDRESS_LABELS),
    customLabel: optionalText(50),
    line1: z
      .string()
      .trim()
      .min(1, { message: "Address line 1 is required" })
      .max(255),
    line2: optionalText(255),
    landmark: optionalText(150),
    city: z.string().trim().min(1, { message: "City is required" }).max(100),
    state: z.string().trim().min(1, { message: "State is required" }).max(100),
    pincode: z
      .string()
      .trim()
      .min(3, { message: "Pincode must be at least 3 characters" })
      .max(10),
    country: z
      .string()
      .trim()
      .min(1, { message: "Country is required" })
      .max(100),
    receiverName: optionalText(100),
    receiverPhone: phoneSchema,
    isPrimary: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.label === "other" && !value.customLabel) {
      context.addIssue({
        code: "custom",
        path: ["customLabel"],
        message: "Custom label is required",
      });
    }
  });

export type AddressFormValues = z.infer<typeof AddressSchema>;
