"use client";

import SaveIcon from "@mui/icons-material/Save";
import TimelineIcon from "@mui/icons-material/Timeline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { KpiSnapshot } from "../types";

type Props = {
  snapshots: KpiSnapshot[];
  isLoading: boolean;
  isCreating: boolean;
  onCreateSnapshot: () => void;
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.25,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Box>{value}</Box>
    </Box>
  );
}

export default function KpiSnapshotCard({
  snapshots,
  isLoading,
  isCreating,
  onCreateSnapshot,
}: Props) {
  const latest = snapshots[snapshots.length - 1] ?? null;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={2}
        gap={1.5}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <TimelineIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            KPI Snapshot
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          size="small"
          startIcon={
            isCreating ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={onCreateSnapshot}
          disabled={isCreating}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Save Snapshot
        </Button>
      </Stack>

      {isLoading ? (
        <Box>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={44} sx={{ mb: 0.5 }} />
          ))}
        </Box>
      ) : !latest ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <TimelineIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography variant="body2" color="text.secondary">
            No KPI snapshots yet. Click Save Snapshot to create one.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Row
            label="Snapshot Date"
            value={
              <Typography variant="body2">
                {new Date(latest.snapshotDate).toLocaleDateString()}
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Body Weight"
            value={
              <Typography variant="body2" fontWeight={600}>
                {latest.bodyWeightKg} kg
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Consistency Score"
            value={
              <Typography
                variant="body2"
                fontWeight={600}
                color={
                  latest.consistencyScore >= 80
                    ? "success.main"
                    : "warning.main"
                }
              >
                {latest.consistencyScore}%
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Strength Index"
            value={
              <Typography variant="body2">
                {latest.strengthIndex.toLocaleString()}
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Sessions This Week"
            value={
              <Typography variant="body2">
                {latest.totalSessionsWeek} / {latest.plannedSessionsWeek}
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Weekly Streak"
            value={
              <Typography variant="body2">
                {latest.weeklyStreak} weeks
              </Typography>
            }
          />
        </Box>
      )}
    </Paper>
  );
}
