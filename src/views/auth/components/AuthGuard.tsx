"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getAccessToken } from "@/libs/authToken";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = getAccessToken();

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  if (!token) return null;
  return <>{children}</>;
}
