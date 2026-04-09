"use client";

import Link from "next/link";
import Typography from "@mui/material/Typography";

import { useAuthActions } from "../hooks/useAuthActions";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const { handleLogin, isLoginLoading, loginError } = useAuthActions();

  return (
    <AuthLayout title="Sign In">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoginLoading}
        error={loginError ?? undefined}
      />
      <Typography
        variant="body2"
        sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          style={{ color: "#10B981", textDecoration: "none", fontWeight: 600 }}
        >
          Sign Up
        </Link>
      </Typography>
    </AuthLayout>
  );
}
