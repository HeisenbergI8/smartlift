"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

type Props = {
  children: React.ReactNode;
  title: string;
};

export default function AuthLayout({ children, title }: Props) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="xs" sx={{ width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Image
            src="/logo.png"
            alt="SmartLift logo"
            width={80}
            height={56}
            priority
            style={{ width: "auto", height: "auto" }}
          />
          <Typography variant="h4" sx={{ color: "text.primary", mt: 1 }}>
            SmartLift
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
            {title}
          </Typography>
          {children}
        </Box>
      </Container>
    </Box>
  );
}
