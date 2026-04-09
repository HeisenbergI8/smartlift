import { createApi } from "@reduxjs/toolkit/query/react";

import { authRtkConfig } from "@/configs/authRtkConfig";
import { authApiService } from "@/views/auth/services/authApi";

import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
} from "@/views/auth/types";

export const authApi = createApi({
  ...authRtkConfig,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginDto>({
      queryFn: async (dto) => {
        try {
          const data = await authApiService.login(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterDto>({
      queryFn: async (dto) => {
        try {
          const data = await authApiService.register(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
    }),
    getMe: builder.query<User, void>({
      queryFn: async () => {
        try {
          const data = await authApiService.getMe();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
