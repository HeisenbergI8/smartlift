import { useCallback, useState } from "react";
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
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (dto: LoginDto) => {
      setLoginError(null);
      try {
        const result = await login(dto).unwrap();
        setAccessToken(result.accessToken);
        toast.success("Welcome back!");
        router.replace("/dashboard");
      } catch {
        setLoginError(
          "Invalid credentials. Please check your email and password.",
        );
      }
    },
    [login, router],
  );

  const handleRegister = useCallback(
    async (dto: RegisterDto) => {
      setRegisterError(null);
      try {
        const result = await register(dto).unwrap();
        setAccessToken(result.accessToken);
        toast.success("Account created!");
        router.replace("/dashboard");
      } catch (err) {
        const message = (err as { message?: string }).message;
        setRegisterError(message ?? "Registration failed. Please try again.");
      }
    },
    [register, router],
  );

  return {
    handleLogin,
    handleRegister,
    isLoginLoading,
    isRegisterLoading,
    loginError,
    registerError,
  };
}
