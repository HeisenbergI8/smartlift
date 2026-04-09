import GuestOnlyRoute from "@/views/auth/components/GuestOnlyRoute";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestOnlyRoute>{children}</GuestOnlyRoute>;
}
