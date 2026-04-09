"use client";

import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ProgressionSettings, TrainingGoal, ProgressionFrequency } from "../types";

type Props = {
  settings: ProgressionSettings | undefined;
  isLoading: boolean;
  onEdit: () => void;
};

const FREQUENCY_LABEL: Record<ProgressionFrequency, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
};

const GOAL_LABEL: Record<TrainingGoal, string> = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  endurance: "Endurance",
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

export default function ProgressionSettingsCard({
  settings,
  isLoading,
  onEdit,
}: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        mb: 4,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          Settings
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onEdit}
          disabled={isLoading}
        >
          Edit Settings
        </Button>
      </Stack>

      {isLoading ? (
        <Box>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={44} sx={{ mb: 0.5 }} />
          ))}
        </Box>
      ) : !settings ? (
        <Typography variant="body2" color="text.secondary">
          No progression settings configured yet. Click Edit Settings to get
          started.
        </Typography>
      ) : (
        <Box>
          <Row
            label="Auto-Progression"
            value={
              <Chip
                size="small"
                color={settings.isEnabled ? "success" : "default"}
                label={settings.isEnabled ? "Enabled" : "Disabled"}
              />
            }
          />
          <Divider />
          <Row
            label="Frequency"
            value={
              <Typography variant="body2">
                {FREQUENCY_LABEL[settings.progressionFrequency]}
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Training Goal"
            value={
              <Chip
                size="small"
                color="primary"
                label={GOAL_LABEL[settings.trainingGoal]}
              />
            }
          />
          <Divider />
          <Row
            label="Weight Increment"
            value={
              <Typography variant="body2">
                {settings.weightIncrementKg} kg
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Max Reps Before Increase"
            value={
              <Typography variant="body2">
                {settings.maxRepsBeforeIncrease} reps
              </Typography>
            }
          />
        </Box>
      )}
    </Paper>
  );
}
