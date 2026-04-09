"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import BodyWeightDialog from "../components/BodyWeightDialog";
import BodyWeightFilters from "../components/BodyWeightFilters";
import BodyWeightLatestCard from "../components/BodyWeightLatestCard";
import BodyWeightTable from "../components/BodyWeightTable";
import WeeklyAveragesChart from "../components/WeeklyAveragesChart";
import { useBodyWeightActions } from "../hooks/useBodyWeightActions";

export default function BodyWeightPage() {
  const [tab, setTab] = useState(0);

  const {
    logs,
    isLogsLoading,
    latest,
    isLatestLoading,
    weeklyAverages,
    isWeeklyLoading,
    dialogOpen,
    openDialog,
    closeDialog,
    isLogging,
    isDeleting,
    handleLogSubmit,
    handleDelete,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    weeksFilter,
    setWeeksFilter,
  } = useBodyWeightActions();

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
              <MonitorWeightIcon sx={{ color: "primary.main" }} />
              <Typography variant="h4" sx={{ color: "text.primary" }}>
                Body Weight
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Track your daily weigh-ins and monitor trends over time
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openDialog}
          >
            Log Weight
          </Button>
        </Stack>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Weight Logs" />
          <Tab label="Weekly Trends" />
        </Tabs>

        {tab === 0 && (
          <>
            <BodyWeightLatestCard latest={latest} isLoading={isLatestLoading} />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={2}
              mb={2}
            >
              <BodyWeightFilters
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
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
              <BodyWeightTable
                logs={logs}
                isLoading={isLogsLoading}
                isDeleting={isDeleting}
                onDelete={handleDelete}
              />
            </Paper>
          </>
        )}

        {tab === 1 && (
          <WeeklyAveragesChart
            weeklyAverages={weeklyAverages}
            isLoading={isWeeklyLoading}
            weeksFilter={weeksFilter}
            onWeeksChange={setWeeksFilter}
          />
        )}
      </Container>

      <BodyWeightDialog
        open={dialogOpen}
        isLoading={isLogging}
        onClose={closeDialog}
        onSubmit={handleLogSubmit}
      />
    </Box>
  );
}
