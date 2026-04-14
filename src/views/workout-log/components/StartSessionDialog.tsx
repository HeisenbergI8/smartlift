"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { WorkoutPlanDay } from "@/views/workout-plans/types";
import type { StartSessionDto } from "../types";

type FormValues = {
  workoutPlanDayId: string;
  notes: string;
};

type Props = {
  open: boolean;
  isSubmitting: boolean;
  activePlanDays: WorkoutPlanDay[];
  activePlanName: string | null;
  onClose: () => void;
  onStart: (dto: StartSessionDto) => void;
};

export default function StartSessionDialog({
  open,
  isSubmitting,
  activePlanDays,
  activePlanName,
  onClose,
  onStart,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { workoutPlanDayId: "", notes: "" },
  });

  useEffect(() => {
    if (open) reset({ workoutPlanDayId: "", notes: "" });
  }, [open, reset]);

  const onSubmit = (values: FormValues) => {
    const dto: StartSessionDto = {
      ...(values.workoutPlanDayId !== "" && {
        workoutPlanDayId: Number(values.workoutPlanDayId),
      }),
      ...(values.notes && { notes: values.notes }),
    };
    onStart(dto);
  };

  const hasPlanDays = activePlanDays.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Start Workout Session</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="start-session-form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2.5}
          sx={{ pt: 1 }}
        >
          <Controller
            name="workoutPlanDayId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Workout Day"
                error={!!errors.workoutPlanDayId}
                helperText={
                  errors.workoutPlanDayId?.message ??
                  (hasPlanDays
                    ? `From active plan: ${activePlanName}`
                    : "No active plan — starting a free session")
                }
                fullWidth
              >
                <MenuItem value="">
                  <Typography variant="body2" color="text.secondary">
                    Free session (no plan)
                  </Typography>
                </MenuItem>
                {activePlanDays.map((day) => (
                  <MenuItem key={day.id} value={String(day.id)}>
                    {day.name
                      ? `Day ${day.dayNumber} — ${day.name}`
                      : `Day ${day.dayNumber}`}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notes (optional)"
                multiline
                rows={3}
                error={!!errors.notes}
                helperText={errors.notes?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="start-session-form"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Starting…" : "Start Session"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
