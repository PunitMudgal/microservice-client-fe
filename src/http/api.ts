import {
  SigninSchemaType,
  SignupRequest,
  type ApiEnvelope,
  type CatalogCategory,
  type CatalogProduct,
  type CreateCustomerOrder,
  type ListMyOrdersQuery,
  type Order,
  type OrderListPage,
  type User,
} from "@/lib/types";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  UpdateProfileInput,
} from "@/lib/profile";
import { apiClient } from "./client";

const AUTH_SERVICE = "/auth/api/v1";
const CATALOG_SERVICE = "/catalog/api/v1";
const ORDER_SERVICE = "/order/api/v1";
export const NESTA_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!;

export const signup = async (credentials: SignupRequest) => {
  const { data } = await apiClient.post(
    `${AUTH_SERVICE}/register`,
    credentials,
  );
  return data;
};

export const signin = async (credentials: SigninSchemaType) => {
  const { data } = await apiClient.post(`${AUTH_SERVICE}/login`, credentials);
  return data;
};

export const logout = async () => {
  await apiClient.post(`${AUTH_SERVICE}/logout`);
};

export const getSelf = async (): Promise<User> => {
  const { data } = await apiClient.get<{ data: User }>(
    `${AUTH_SERVICE}/user/self`,
  );
  return data.data;
};

export const updateMyProfile = async (
  userId: string,
  payload: UpdateProfileInput,
): Promise<User> => {
  const { data } = await apiClient.patch<{
    data: { user: User };
  }>(`${AUTH_SERVICE}/user/${userId}`, payload);
  return data.data.user;
};

export const listMyAddresses = async (): Promise<Address[]> => {
  const { data } = await apiClient.get<{
    data: { addresses: Address[] };
  }>(`${AUTH_SERVICE}/address`, { params: { isActive: true } });
  return data.data.addresses;
};

export const createMyAddress = async (
  payload: CreateAddressInput,
): Promise<Address> => {
  const { data } = await apiClient.post<{
    data: { address: Address };
  }>(`${AUTH_SERVICE}/address`, payload);
  return data.data.address;
};

export const updateMyAddress = async (
  addressId: string,
  payload: UpdateAddressInput,
): Promise<Address> => {
  const { data } = await apiClient.patch<{
    data: { address: Address };
  }>(`${AUTH_SERVICE}/address/${addressId}`, payload);
  return data.data.address;
};

export const deleteMyAddress = async (addressId: string): Promise<void> => {
  await apiClient.delete(`${AUTH_SERVICE}/address/${addressId}`);
};

export const getPublicMenu = async (
  tenantId = NESTA_TENANT_ID,
): Promise<CatalogCategory[]> => {
  const { data } = await apiClient.get<ApiEnvelope<CatalogCategory[]>>(
    `${CATALOG_SERVICE}/${tenantId}/menu`,
  );
  return data.data;
};

export const getPublicProduct = async (
  productId: string,
  tenantId = NESTA_TENANT_ID,
): Promise<CatalogProduct> => {
  const { data } = await apiClient.get<ApiEnvelope<CatalogProduct>>(
    `${CATALOG_SERVICE}/${tenantId}/products/${productId}`,
  );
  return data.data;
};

export const listMyOrders = async (
  query: ListMyOrdersQuery = {},
): Promise<OrderListPage> => {
  const { data } = await apiClient.get<ApiEnvelope<OrderListPage>>(
    `${ORDER_SERVICE}/orders`,
    { params: query },
  );
  return data.data;
};

export const getMyOrder = async (orderId: string): Promise<Order> => {
  const { data } = await apiClient.get<ApiEnvelope<Order>>(
    `${ORDER_SERVICE}/orders/${orderId}`,
  );
  return data.data;
};

export const placeMyOrder = async (
  payload: CreateCustomerOrder,
): Promise<Order> => {
  const { data } = await apiClient.post<ApiEnvelope<Order>>(
    `${ORDER_SERVICE}/orders`,
    payload,
  );
  return data.data;
};

export const cancelMyOrder = async (
  orderId: string,
  cancelReason?: string,
): Promise<Order> => {
  const { data } = await apiClient.patch<ApiEnvelope<Order>>(
    `${ORDER_SERVICE}/orders/${orderId}/cancel`,
    cancelReason ? { cancelReason } : {},
  );
  return data.data;
};
