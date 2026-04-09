"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import type {
  ProgressionFrequency,
  ProgressionSettings,
  TrainingGoal,
  UpdateProgressionSettingsDto,
} from "../types";

type Props = {
  open: boolean;
  settings: ProgressionSettings | undefined;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: UpdateProgressionSettingsDto) => void;
};

type FormValues = {
  isEnabled: boolean;
  progressionFrequency: ProgressionFrequency;
  trainingGoal: TrainingGoal;
  weightIncrementKg: number;
  maxRepsBeforeIncrease: number;
};

const FREQUENCY_OPTIONS: { value: ProgressionFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const GOAL_OPTIONS: { value: TrainingGoal; label: string }[] = [
  { value: "strength", label: "Strength (1–5 reps)" },
  { value: "hypertrophy", label: "Hypertrophy (6–15 reps)" },
  { value: "endurance", label: "Endurance (15+ reps)" },
];

const DEFAULT_VALUES: FormValues = {
  isEnabled: true,
  progressionFrequency: "weekly",
  trainingGoal: "hypertrophy",
  weightIncrementKg: 2.5,
  maxRepsBeforeIncrease: 12,
};

export default function ProgressionSettingsDialog({
  open,
  settings,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(
        settings
          ? {
              isEnabled: settings.isEnabled,
              progressionFrequency: settings.progressionFrequency,
              trainingGoal: settings.trainingGoal,
              weightIncrementKg: settings.weightIncrementKg,
              maxRepsBeforeIncrease: settings.maxRepsBeforeIncrease,
            }
          : DEFAULT_VALUES,
      );
    }
  }, [open, settings, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      isEnabled: values.isEnabled,
      progressionFrequency: values.progressionFrequency,
      trainingGoal: values.trainingGoal,
      weightIncrementKg: Number(values.weightIncrementKg),
      maxRepsBeforeIncrease: Number(values.maxRepsBeforeIncrease),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>Progression Settings</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            pt: "16px !important",
          }}
        >
          <Controller
            name="isEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                label="Enable auto-progression"
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    color="success"
                  />
                }
              />
            )}
          />

          <Controller
            name="progressionFrequency"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Frequency</InputLabel>
                <Select label="Frequency" {...field}>
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="trainingGoal"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth size="small">
                <InputLabel>Training Goal</InputLabel>
                <Select label="Training Goal" {...field}>
                  {GOAL_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="weightIncrementKg"
            control={control}
            rules={{ required: true, min: 0.5 }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Weight Increment (kg)"
                size="small"
                type="number"
                inputProps={{ step: 0.5, min: 0.5 }}
              />
            )}
          />

          <Controller
            name="maxRepsBeforeIncrease"
            control={control}
            rules={{ required: true, min: 1 }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Max Reps Before Weight Increase"
                size="small"
                type="number"
                inputProps={{ step: 1, min: 1 }}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save Settings"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
