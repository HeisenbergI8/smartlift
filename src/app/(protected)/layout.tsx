import Box from "@mui/material/Box";
import AppNavigation from "@/components/AppNavigation";
import AuthGuard from "@/views/auth/components/AuthGuard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppNavigation />
      <Box component="main" sx={{ ml: { xs: 0, sm: "64px", md: "240px" } }}>
        {children}
      </Box>
    </AuthGuard>
  );
}
