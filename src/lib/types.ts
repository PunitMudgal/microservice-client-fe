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

export interface CatalogVariant {
  id: string;
  productId: string;
  label: string;
  price: string;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
  deletedAt?: string | null;
}

export interface CatalogAddOn {
  id: string;
  tenantId: string;
  name: string;
  price: string;
  isActive: boolean;
  deletedAt?: string | null;
}

export interface CatalogProduct {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isVeg?: boolean | null;
  isActive: boolean;
  displayOrder: number;
  attributes?: Record<string, unknown> | null;
  variants: CatalogVariant[];
  addOns?: CatalogAddOn[];
}

export interface CatalogCategory {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  parentId?: string | null;
  displayOrder: number;
  icon?: string | null;
  isActive: boolean;
  products?: CatalogProduct[];
  children?: CatalogCategory[];
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderType = "dine_in" | "takeaway" | "delivery";

export interface DeliveryAddress {
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  phone: string;
}

export interface CreateOrderItemAddOn {
  addOnId: string;
  quantity?: number;
}

export interface CreateOrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  addOns?: CreateOrderItemAddOn[];
}

export interface CreateCustomerOrder {
  orderType: OrderType;
  items: CreateOrderItem[];
  deliveryAddress?: DeliveryAddress;
  tableNumber?: string;
  notes?: string;
}

export interface OrderItemAddOn {
  id: string;
  orderItemId: string;
  addOnId: string;
  addOnName: string;
  addOnPrice: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  createdAt: string;
  addOns?: OrderItemAddOn[];
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  changedBy: string;
  note?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  tenantId: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  orderType: OrderType;
  subtotal: string;
  addOnsTotal: string;
  discountTotal: string;
  taxTotal: string;
  grandTotal: string;
  deliveryAddress?: DeliveryAddress | null;
  tableNumber?: string | null;
  notes?: string | null;
  placedAt: string;
  confirmedAt?: string | null;
  readyAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
}

export interface OrderListPage {
  items: Order[];
  page: number;
  limit: number;
  total: number;
}

export interface ListMyOrdersQuery {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export const DeliveryAddressSchema = z.object({
  line1: z
    .string()
    .trim()
    .min(1, { message: "Street address is required" })
    .max(255),
  line2: z
    .string()
    .trim()
    .max(255)
    .optional()
    .transform((value) => value || undefined),
  city: z.string().trim().min(1, { message: "City is required" }).max(100),
  pincode: z
    .string()
    .trim()
    .min(4, { message: "Pincode is too short" })
    .max(12),
  phone: z
    .string()
    .trim()
    .min(8, { message: "Phone number is too short" })
    .max(20),
});

export const CheckoutSchema = z
  .object({
    orderType: z.enum(["dine_in", "takeaway", "delivery"]),
    tableNumber: z.string().trim().max(20).optional(),
    notes: z.string().trim().max(1000).optional(),
    line1: z.string().trim().max(255).optional(),
    line2: z.string().trim().max(255).optional(),
    city: z.string().trim().max(100).optional(),
    pincode: z.string().trim().max(12).optional(),
    phone: z.string().trim().max(20).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.orderType === "dine_in" && !value.tableNumber) {
      ctx.addIssue({
        code: "custom",
        path: ["tableNumber"],
        message: "Table number is required for dine in",
      });
    }

    if (value.orderType === "delivery") {
      const parsedAddress = DeliveryAddressSchema.safeParse({
        line1: value.line1,
        line2: value.line2,
        city: value.city,
        pincode: value.pincode,
        phone: value.phone,
      });

      if (!parsedAddress.success) {
        for (const issue of parsedAddress.error.issues) {
          ctx.addIssue({
            code: "custom",
            path: issue.path,
            message: issue.message,
          });
        }
      }
    }
  });

export type CheckoutSchemaType = z.infer<typeof CheckoutSchema>;

export const CancelOrderSchema = z.object({
  cancelReason: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => value || undefined),
});

export type CancelOrderSchemaType = z.infer<typeof CancelOrderSchema>;