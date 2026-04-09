"use client";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import EgoLiftFilters from "../components/EgoLiftFilters";
import EgoLiftTable from "../components/EgoLiftTable";
import { useEgoLiftActions } from "../hooks/useEgoLiftActions";

export default function EgoLiftPage() {
  const {
    alerts,
    isLoading,
    exerciseIdFilter,
    handleExerciseFilter,
    handleDismiss,
  } = useEgoLiftActions();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(239, 68, 68, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
        px: 2,
        pt: { xs: 3, sm: 4 },
        pb: { xs: 10, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Page header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={3}
          gap={2}
          flexWrap="wrap"
        >
          <Box>
            <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
              <WarningAmberIcon sx={{ color: "error.main" }} />
              <Typography variant="h4" sx={{ color: "text.primary" }}>
                Ego-Lift Alerts
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Auto-detected dangerous weight jumps — review and dismiss when
              addressed
            </Typography>
          </Box>
        </Stack>

        {/* Filters */}
        <Box mb={3}>
          <EgoLiftFilters
            exerciseIdFilter={exerciseIdFilter}
            onExerciseChange={handleExerciseFilter}
          />
        </Box>

        {/* Table */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <EgoLiftTable
            alerts={alerts}
            isLoading={isLoading}
            onDismiss={handleDismiss}
          />
        </Paper>
      </Container>
    </Box>
  );
}
