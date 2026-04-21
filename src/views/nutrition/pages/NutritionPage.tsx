"use client";

import { useState } from "react";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddIcon from "@mui/icons-material/Add";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import AdjustmentHistoryTable from "../components/AdjustmentHistoryTable";
import DailyLogDialog from "../components/DailyLogDialog";
import DailyLogTable from "../components/DailyLogTable";
import NutritionHistoryTable from "../components/NutritionHistoryTable";
import NutritionRecommendationCard from "../components/NutritionRecommendationCard";
import NutritionRecommendationDialog from "../components/NutritionRecommendationDialog";
import { useDailyNutritionActions } from "../hooks/useDailyNutritionActions";
import { useNutritionActions } from "../hooks/useNutritionActions";

export default function NutritionPage() {
  const [tab, setTab] = useState(0);

  const {
    active,
    isActiveLoading,
    history,
    isHistoryLoading,
    dialogOpen,
    openDialog,
    closeDialog,
    isCreating,
    isGenerating,
    handleCreate,
    handleGenerate,
  } = useNutritionActions();

  const {
    logs,
    isLogsLoading,
    adjustments,
    isAdjustmentsLoading,
    dialogOpen: logDialogOpen,
    openDialog: openLogDialog,
    closeDialog: closeLogDialog,
    isLogging,
    handleLogSubmit,
    isDetecting,
    handleDetectPlateau,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  } = useDailyNutritionActions();

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
              <RestaurantMenuIcon sx={{ color: "primary.main" }} />
              <Typography variant="h4" sx={{ color: "text.primary" }}>
                Nutrition
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              TDEE-based calorie and macro recommendations
            </Typography>
          </Box>
        </Stack>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Recommendations" />
          <Tab label="Daily Logs" />
          <Tab label="Smart Adjustments" />
        </Tabs>

        {tab === 0 && (
          <>
            <NutritionRecommendationCard
              active={active}
              isLoading={isActiveLoading}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              onAdd={openDialog}
            />
            <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
              Recommendation History
            </Typography>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <NutritionHistoryTable
                history={history}
                isLoading={isHistoryLoading}
              />
            </Paper>
          </>
        )}

        {tab === 1 && (
          <>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={2}
              mb={2}
            >
              <Stack direction="row" gap={1.5} flexWrap="wrap" sx={{ flex: 1 }}>
                <TextField
                  label="From"
                  type="date"
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { colorScheme: "dark" } }}
                  sx={{ flex: 1, minWidth: 120 }}
                />
                <TextField
                  label="To"
                  type="date"
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { colorScheme: "dark" } }}
                  sx={{ flex: 1, minWidth: 120 }}
                />
              </Stack>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openLogDialog}
              >
                Log Today
              </Button>
            </Stack>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <DailyLogTable logs={logs} isLoading={isLogsLoading} />
            </Paper>
          </>
        )}

        {tab === 2 && (
          <>
            <Stack direction="row" justifyContent="flex-end" mb={2}>
              <Tooltip
                title="Analyzes your last 3 weeks of body-weight logs to detect a stall and auto-adjust your calorie target"
                placement="left"
                arrow
              >
                <span>
                  <Button
                    variant="outlined"
                    startIcon={<TroubleshootIcon />}
                    onClick={handleDetectPlateau}
                    disabled={isDetecting}
                  >
                    {isDetecting ? "Detecting…" : "Detect Plateau"}
                  </Button>
                </span>
              </Tooltip>
            </Stack>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <AdjustmentHistoryTable
                adjustments={adjustments}
                isLoading={isAdjustmentsLoading}
              />
            </Paper>
          </>
        )}
      </Container>

      <NutritionRecommendationDialog
        open={dialogOpen}
        isLoading={isCreating}
        onClose={closeDialog}
        onSubmit={handleCreate}
      />

      <DailyLogDialog
        open={logDialogOpen}
        isLoading={isLogging}
        onClose={closeLogDialog}
        onSubmit={handleLogSubmit}
      />
    </Box>
  );
}
