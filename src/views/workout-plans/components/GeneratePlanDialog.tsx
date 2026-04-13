"use client";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";

import type { GenerateWorkoutPlanDto, TrainingGoal } from "../types";

const TRAINING_GOALS: { value: TrainingGoal; label: string }[] = [
  { value: "strength", label: "Strength" },
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "endurance", label: "Endurance" },
  { value: "general", label: "General" },
];

type FormValues = {
  name: string;
  trainingGoalOverride: TrainingGoal | "";
  daysPerWeekOverride: number | "";
};

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onGenerate: (dto: GenerateWorkoutPlanDto) => void;
};

export default function GeneratePlanDialog({
  open,
  isSubmitting,
  onClose,
  onGenerate,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      trainingGoalOverride: "",
      daysPerWeekOverride: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    const dto: GenerateWorkoutPlanDto = {};
    if (values.name.trim()) dto.name = values.name.trim();
    if (values.trainingGoalOverride)
      dto.trainingGoalOverride = values.trainingGoalOverride;
    if (values.daysPerWeekOverride !== "")
      dto.daysPerWeekOverride = Number(values.daysPerWeekOverride);
    onGenerate(dto);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AutoAwesomeIcon fontSize="small" color="primary" />
        Auto-Generate Plan
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack gap={2.5}>
            <Typography variant="body2" color="text.secondary">
              The system will build a personalised plan from your profile
              (fitness goal, training days, equipment). All fields are optional
              — leave blank to use your profile defaults.
            </Typography>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Plan Name"
                  placeholder="Auto-Generated Hypertrophy Plan"
                  helperText="Leave blank to auto-name from goal"
                />
              )}
            />

            <Controller
              name="trainingGoalOverride"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel shrink>Goal Override</InputLabel>
                  <Select {...field} label="Goal Override" displayEmpty notched>
                    <MenuItem value="">
                      <em>Use profile default</em>
                    </MenuItem>
                    {TRAINING_GOALS.map((g) => (
                      <MenuItem key={g.value} value={g.value}>
                        {g.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="daysPerWeekOverride"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel shrink>Days / Week Override</InputLabel>
                  <Select
                    {...field}
                    label="Days / Week Override"
                    displayEmpty
                    notched
                  >
                    <MenuItem value="">
                      <em>Use profile default</em>
                    </MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <MenuItem key={n} value={n}>
                        {n}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={14} />
              ) : (
                <AutoAwesomeIcon fontSize="small" />
              )
            }
          >
            {isSubmitting ? "Generating…" : "Generate Plan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
