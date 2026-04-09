"use client";

import Link from "next/link";
import Typography from "@mui/material/Typography";

import { useAuthActions } from "../hooks/useAuthActions";
import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  const { handleRegister, isRegisterLoading } = useAuthActions();

  return (
    <AuthLayout title="Create Account">
      <RegisterForm onSubmit={handleRegister} isLoading={isRegisterLoading} />
      <Typography
        variant="body2"
        sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          style={{ color: "#10B981", textDecoration: "none", fontWeight: 600 }}
        >
          Sign In
        </Link>
      </Typography>
    </AuthLayout>
  );
}
