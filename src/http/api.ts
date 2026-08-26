import { SigninSchemaType, SignupRequest, type User } from "@/lib/types";
import { apiClient } from "./client";

const AUTH_SERVICE = "/api/v1/auth";

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
