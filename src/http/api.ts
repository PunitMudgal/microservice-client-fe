import {
  SigninSchemaType,
  SignupRequest,
  type ApiEnvelope,
  type CatalogCategory,
  type CatalogProduct,
  type User,
} from "@/lib/types";
import { apiClient } from "./client";

const AUTH_SERVICE = "/auth/api/v1";
const CATALOG_SERVICE = "/catalog/api/v1";
export const NESTA_TENANT_ID = "fbb3649a-5ef9-4c4d-be0d-46aecbdb2061";

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
