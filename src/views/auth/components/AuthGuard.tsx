"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAccessToken } from "@/libs/authToken";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // TODO: re-enable when backend auth is connected
    // const token = getAccessToken();
    // if (!token) {
    //   router.replace("/login");
    // } else {
    //   setChecked(true);
    // }
    void getAccessToken();
    setChecked(true);
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}
