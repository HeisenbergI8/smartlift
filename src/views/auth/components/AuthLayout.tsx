"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function AuthLayout({ children, title, subtitle }: Props) {
  return (
    <Box
      sx={{
        height: "100dvh",
        overflow: { xs: "auto", md: "hidden" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 60%), linear-gradient(180deg, #080B10 0%, #111827 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="xs" sx={{ width: "100%" }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            boxShadow:
              "0 0 0 1px rgba(16,185,129,0.06), 0 24px 48px -12px rgba(0,0,0,0.6)",
            p: { xs: 3, sm: 4 },
          }}
        >
          {/* ── Brand inside card ─────────────────────────── */}
          <Stack alignItems="center" spacing={0.75} sx={{ mb: 2.5 }}>
            <Image
              src="/logo.png"
              alt="SmartLift"
              width={669}
              height={373}
              priority
              style={{ width: 64, height: "auto" }}
            />
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.3px",
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              SmartLift
            </Typography>
          </Stack>

          <Divider sx={{ mb: 2.5 }} />

          {/* ── Form title ────────────────────────────────── */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              mb: subtitle ? 0.75 : 2.5,
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "text.secondary", mb: 2.5 }}
            >
              {subtitle}
            </Typography>
          )}

          {children}
        </Box>
      </Container>
    </Box>
  );
}
