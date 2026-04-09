"use client";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ProgressionHistoryFilters from "../components/ProgressionHistoryFilters";
import ProgressionHistoryTable from "../components/ProgressionHistoryTable";
import ProgressionSettingsCard from "../components/ProgressionSettingsCard";
import ProgressionSettingsDialog from "../components/ProgressionSettingsDialog";
import { useProgressionActions } from "../hooks/useProgressionActions";

export default function ProgressionPage() {
  const {
    settings,
    isSettingsLoading,
    history,
    isHistoryLoading,
    settingsDialogOpen,
    openSettingsDialog,
    closeSettingsDialog,
    isUpserting,
    isEvaluating,
    exerciseIdFilter,
    handleExerciseFilter,
    handleUpsertSettings,
    handleEvaluate,
  } = useProgressionActions();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
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
          mb={4}
          gap={2}
          flexWrap="wrap"
        >
          <Box>
            <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
              <TrendingUpIcon sx={{ color: "primary.main" }} />
              <Typography variant="h4" sx={{ color: "text.primary" }}>
                Progression Tracking
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Automatic weight, reps, and sets adjustment recommendations
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={
              isEvaluating ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <TrendingUpIcon />
              )
            }
            onClick={handleEvaluate}
            disabled={isEvaluating}
          >
            Run Evaluation
          </Button>
        </Stack>

        {/* Settings card */}
        <ProgressionSettingsCard
          settings={settings}
          isLoading={isSettingsLoading}
          onEdit={openSettingsDialog}
        />

        {/* History section header */}
        <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
          Adjustment History
        </Typography>

        {/* Filters */}
        <Box mb={3}>
          <ProgressionHistoryFilters
            exerciseIdFilter={exerciseIdFilter}
            onExerciseChange={handleExerciseFilter}
          />
        </Box>

        {/* History table */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <ProgressionHistoryTable
            history={history}
            isLoading={isHistoryLoading}
          />
        </Paper>
      </Container>

      <ProgressionSettingsDialog
        open={settingsDialogOpen}
        settings={settings}
        isLoading={isUpserting}
        onClose={closeSettingsDialog}
        onSubmit={handleUpsertSettings}
      />
    </Box>
  );
}
