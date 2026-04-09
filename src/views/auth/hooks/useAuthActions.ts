import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  useLoginMutation,
  useRegisterMutation,
} from "@/store/services/authApi";
import { setAccessToken } from "@/libs/authToken";

import type { LoginDto, RegisterDto } from "../types";

export function useAuthActions() {
  const router = useRouter();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleLogin = useCallback(
    async (dto: LoginDto) => {
      try {
        const result = await login(dto).unwrap();
        setAccessToken(result.accessToken);
        toast.success("Welcome back!");
        router.replace("/dashboard");
      } catch (err) {
        toast.error((err as Error).message ?? "Login failed");
      }
    },
    [login, router],
  );

  const handleRegister = useCallback(
    async (dto: RegisterDto) => {
      try {
        const result = await register(dto).unwrap();
        setAccessToken(result.accessToken);
        toast.success("Account created!");
        router.replace("/dashboard");
      } catch (err) {
        toast.error((err as Error).message ?? "Registration failed");
      }
    },
    [register, router],
  );

  return {
    handleLogin,
    handleRegister,
    isLoginLoading,
    isRegisterLoading,
  };
}
