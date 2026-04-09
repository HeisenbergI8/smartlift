import Box from "@mui/material/Box";
import AppHeader from "@/components/AppHeader";
import AppNavigation from "@/components/AppNavigation";
import AuthGuard from "@/views/auth/components/AuthGuard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppHeader />
      <AppNavigation />
      <Box
        component="main"
        sx={{
          ml: { xs: 0, sm: "72px", md: "260px" },
          pt: { xs: "56px", sm: "64px" },
          pb: { xs: "80px", sm: 0 },
        }}
      >
        {children}
      </Box>
    </AuthGuard>
  );
}
