"use client";

import { useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import DashboardOverviewCards from "../components/DashboardOverviewCards";
import KpiSnapshotCard from "../components/KpiSnapshotCard";
import NutritionAdherenceChart from "../components/NutritionAdherenceChart";
import StrengthProgressList from "../components/StrengthProgressList";
import WeightTrendChart from "../components/WeightTrendChart";
import WorkoutConsistencyChart from "../components/WorkoutConsistencyChart";
import { useDashboardActions } from "../hooks/useDashboardActions";

export default function DashboardPage() {
  const [tab, setTab] = useState(0);

  const {
    overview,
    isOverviewLoading,
    strengthProgress,
    isStrengthLoading,
    weightTrend,
    isWeightTrendLoading,
    period,
    setPeriod,
    workoutConsistency,
    isConsistencyLoading,
    nutritionAdherence,
    isAdherenceLoading,
    kpiSnapshots,
    isSnapshotsLoading,
    isCreatingSnapshot,
    handleCreateSnapshot,
  } = useDashboardActions();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
        px: 2,
        pt: { xs: 3, sm: 4 },
        pb: { xs: 10, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
          <DashboardIcon sx={{ color: "primary.main" }} />
          <Typography variant="h4" sx={{ color: "text.primary" }}>
            Dashboard
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          KPI snapshots, trends, and analytics at a glance
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Overview" />
          <Tab label="Strength" />
          <Tab label="Weight Trend" />
          <Tab label="Consistency" />
          <Tab label="Nutrition" />
        </Tabs>

        {tab === 0 && (
          <>
            <DashboardOverviewCards
              overview={overview}
              isLoading={isOverviewLoading}
            />
            <KpiSnapshotCard
              snapshots={kpiSnapshots}
              isLoading={isSnapshotsLoading}
              isCreating={isCreatingSnapshot}
              onCreateSnapshot={handleCreateSnapshot}
            />
          </>
        )}

        {tab === 1 && (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <StrengthProgressList
              records={strengthProgress?.records ?? []}
              isLoading={isStrengthLoading}
            />
          </Paper>
        )}

        {tab === 2 && (
          <WeightTrendChart
            trend={weightTrend}
            isLoading={isWeightTrendLoading}
            period={period}
            onPeriodChange={setPeriod}
          />
        )}

        {tab === 3 && (
          <WorkoutConsistencyChart
            consistency={workoutConsistency}
            isLoading={isConsistencyLoading}
          />
        )}

        {tab === 4 && (
          <NutritionAdherenceChart
            adherence={nutritionAdherence}
            isLoading={isAdherenceLoading}
          />
        )}
      </Container>
    </Box>
  );
}
