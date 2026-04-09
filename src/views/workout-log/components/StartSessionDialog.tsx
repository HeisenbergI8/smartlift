"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import type { StartSessionDto } from "../types";

type FormValues = {
  workoutPlanDayId: string;
  notes: string;
};

type Props = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onStart: (dto: StartSessionDto) => void;
};

export default function StartSessionDialog({
  open,
  isSubmitting,
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
                label="Workout Plan Day ID (optional)"
                type="number"
                inputProps={{ min: 1 }}
                error={!!errors.workoutPlanDayId}
                helperText={
                  errors.workoutPlanDayId?.message ??
                  "Leave blank for a free session"
                }
                fullWidth
              />
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
