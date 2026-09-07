import type {
  CatalogAddOn,
  CatalogProduct,
  CatalogVariant,
  CreateCustomerOrder,
  CreateOrderItem,
  OrderType,
} from "@/lib/types";

export interface CartAddOn {
  addOnId: string;
  name: string;
  price: string;
  quantity: number;
}

export interface CartLine {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  unitPrice: string;
  quantity: number;
  imageUrl?: string | null;
  addOns: CartAddOn[];
}

export function makeCartLineId(
  productId: string,
  variantId: string,
  addOns: Pick<CartAddOn, "addOnId" | "quantity">[],
) {
  const extras = [...addOns]
    .sort((a, b) => a.addOnId.localeCompare(b.addOnId))
    .map((addOn) => `${addOn.addOnId}:${addOn.quantity}`)
    .join(",");

  return `${productId}:${variantId}:${extras}`;
}

export function parseMoney(value?: string) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

export function lineEstimate(line: CartLine) {
  const extras = line.addOns.reduce(
    (sum, addOn) => sum + parseMoney(addOn.price) * addOn.quantity,
    0,
  );
  return parseMoney(line.unitPrice) * line.quantity + extras;
}

export function cartEstimate(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + lineEstimate(line), 0);
}

export function cartItemCount(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function toOrderItems(lines: CartLine[]): CreateOrderItem[] {
  return lines.map((line) => ({
    productId: line.productId,
    variantId: line.variantId,
    quantity: line.quantity,
    addOns:
      line.addOns.length > 0
        ? line.addOns.map((addOn) => ({
            addOnId: addOn.addOnId,
            quantity: addOn.quantity,
          }))
        : undefined,
  }));
}

export function buildCustomerOrder(input: {
  orderType: OrderType;
  lines: CartLine[];
  tableNumber?: string;
  notes?: string;
  deliveryAddress?: CreateCustomerOrder["deliveryAddress"];
}): CreateCustomerOrder {
  const payload: CreateCustomerOrder = {
    orderType: input.orderType,
    items: toOrderItems(input.lines),
  };

  if (input.notes) payload.notes = input.notes;
  if (input.orderType === "dine_in" && input.tableNumber) {
    payload.tableNumber = input.tableNumber;
  }
  if (input.orderType === "delivery" && input.deliveryAddress) {
    payload.deliveryAddress = input.deliveryAddress;
  }

  return payload;
}

export function createCartLine(input: {
  product: CatalogProduct;
  variant: CatalogVariant;
  quantity: number;
  addOns: CatalogAddOn[];
  addOnQuantities: Record<string, number>;
}): CartLine {
  const selectedAddOns = input.addOns
    .filter((addOn) => (input.addOnQuantities[addOn.id] ?? 0) > 0)
    .map((addOn) => ({
      addOnId: addOn.id,
      name: addOn.name,
      price: addOn.price,
      quantity: input.addOnQuantities[addOn.id],
    }));

  return {
    id: makeCartLineId(input.product.id, input.variant.id, selectedAddOns),
    productId: input.product.id,
    variantId: input.variant.id,
    productName: input.product.name,
    variantLabel: input.variant.label,
    unitPrice: input.variant.price,
    quantity: input.quantity,
    imageUrl: input.product.imageUrl,
    addOns: selectedAddOns,
  };
}
