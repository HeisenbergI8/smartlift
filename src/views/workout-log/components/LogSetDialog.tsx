"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import type { LogSetDto } from "../types";

type ExerciseOption = { id: number; name: string };

const RPE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type FormValues = {
  exerciseId: string;
  setNumber: string;
  reps: string;
  weightKg: string;
  rpe: string;
  isWarmup: boolean;
  notes: string;
};

type Props = {
  open: boolean;
  isSubmitting: boolean;
  nextSetNumber: number;
  exercises: ExerciseOption[];
  onClose: () => void;
  onSubmit: (dto: LogSetDto) => void;
};

export default function LogSetDialog({
  open,
  isSubmitting,
  nextSetNumber,
  exercises,
  onClose,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      exerciseId: "",
      setNumber: String(nextSetNumber),
      reps: "",
      weightKg: "",
      rpe: "",
      isWarmup: false,
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        exerciseId: "",
        setNumber: String(nextSetNumber),
        reps: "",
        weightKg: "",
        rpe: "",
        isWarmup: false,
        notes: "",
      });
    }
  }, [open, nextSetNumber, reset]);

  const handleFormSubmit = (values: FormValues) => {
    const dto: LogSetDto = {
      exerciseId: Number(values.exerciseId),
      setNumber: Number(values.setNumber),
      reps: Number(values.reps),
      ...(values.weightKg !== "" && { weightKg: Number(values.weightKg) }),
      ...(values.rpe !== "" && { rpe: Number(values.rpe) }),
      isWarmup: values.isWarmup,
      ...(values.notes && { notes: values.notes }),
    };
    onSubmit(dto);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Log Set</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="log-set-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          spacing={2.5}
          sx={{ pt: 1 }}
        >
          <Controller
            name="exerciseId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Exercise"
                error={!!errors.exerciseId}
                helperText={errors.exerciseId?.message}
                fullWidth
              >
                {exercises.map((ex) => (
                  <MenuItem key={ex.id} value={String(ex.id)}>
                    {ex.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Stack direction="row" spacing={2}>
            <Controller
              name="setNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Set #"
                  type="number"
                  inputProps={{ min: 1 }}
                  error={!!errors.setNumber}
                  helperText={errors.setNumber?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="reps"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Reps"
                  type="number"
                  inputProps={{ min: 1 }}
                  error={!!errors.reps}
                  helperText={errors.reps?.message}
                  fullWidth
                />
              )}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Controller
              name="weightKg"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Weight (kg)"
                  type="number"
                  inputProps={{ min: 0, step: 0.5 }}
                  error={!!errors.weightKg}
                  helperText={errors.weightKg?.message ?? "Optional"}
                  fullWidth
                />
              )}
            />
            <Controller
              name="rpe"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="RPE"
                  error={!!errors.rpe}
                  helperText={errors.rpe?.message ?? "Optional"}
                  fullWidth
                >
                  <MenuItem value="">—</MenuItem>
                  {RPE_OPTIONS.map((r) => (
                    <MenuItem key={r} value={String(r)}>
                      {r}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Notes (optional)"
                multiline
                rows={2}
                error={!!errors.notes}
                helperText={errors.notes?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="isWarmup"
            control={control}
            render={({ field }) => (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Warmup set"
                />
                {errors.isWarmup && (
                  <FormHelperText error>
                    {errors.isWarmup.message}
                  </FormHelperText>
                )}
              </>
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
          form="log-set-form"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving…" : "Log Set"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
