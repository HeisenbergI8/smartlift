"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import type {
  CreateWorkoutPlanDto,
  TrainingGoal,
  UpdateWorkoutPlanDto,
  WorkoutPlan,
} from "../types";

const TRAINING_GOALS: { value: TrainingGoal; label: string }[] = [
  { value: "strength", label: "Strength" },
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "endurance", label: "Endurance" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "general_fitness", label: "General Fitness" },
];

type FormValues = {
  name: string;
  description: string;
  trainingGoal: TrainingGoal;
  daysPerWeek: number;
  durationWeeks: number;
};

type WorkoutPlanDialogProps = {
  open: boolean;
  editTarget: WorkoutPlan | null;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (dto: CreateWorkoutPlanDto) => void;
  onUpdate: (id: number, dto: UpdateWorkoutPlanDto) => void;
};

export default function WorkoutPlanDialog({
  open,
  editTarget,
  isSubmitting,
  onClose,
  onCreate,
  onUpdate,
}: WorkoutPlanDialogProps) {
  const isEdit = editTarget !== null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      trainingGoal: "general_fitness",
      daysPerWeek: 3,
      durationWeeks: 8,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editTarget?.name ?? "",
        description: editTarget?.description ?? "",
        trainingGoal: editTarget?.trainingGoal ?? "general_fitness",
        daysPerWeek: editTarget?.daysPerWeek ?? 3,
        durationWeeks: editTarget?.durationWeeks ?? 8,
      });
    }
  }, [open, editTarget, reset]);

  const onSubmit = (values: FormValues) => {
    if (isEdit && editTarget) {
      onUpdate(editTarget.id, {
        name: values.name,
        description: values.description || undefined,
        trainingGoal: values.trainingGoal,
        daysPerWeek: values.daysPerWeek,
        durationWeeks: values.durationWeeks,
      });
    } else {
      onCreate({
        name: values.name,
        description: values.description || undefined,
        trainingGoal: values.trainingGoal,
        daysPerWeek: values.daysPerWeek,
        durationWeeks: values.durationWeeks,
        days: [],
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit Workout Plan" : "New Workout Plan"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack gap={2.5} pt={0.5}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Plan Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="trainingGoal"
              control={control}
              rules={{ required: "Training goal is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.trainingGoal}>
                  <InputLabel>Training Goal</InputLabel>
                  <Select {...field} label="Training Goal">
                    {TRAINING_GOALS.map((g) => (
                      <MenuItem key={g.value} value={g.value}>
                        {g.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.trainingGoal && (
                    <FormHelperText>
                      {errors.trainingGoal.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Stack direction="row" gap={2}>
              <Controller
                name="daysPerWeek"
                control={control}
                rules={{
                  required: "Required",
                  min: { value: 1, message: "Min 1" },
                  max: { value: 7, message: "Max 7" },
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.daysPerWeek}>
                    <InputLabel>Days / Week</InputLabel>
                    <Select {...field} label="Days / Week">
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <MenuItem key={n} value={n}>
                          {n}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.daysPerWeek && (
                      <FormHelperText>
                        {errors.daysPerWeek.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="durationWeeks"
                control={control}
                rules={{
                  required: "Required",
                  min: { value: 1, message: "Min 1 week" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Duration (weeks)"
                    type="number"
                    fullWidth
                    error={!!errors.durationWeeks}
                    helperText={errors.durationWeeks?.message}
                    slotProps={{ htmlInput: { min: 1 } }}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                )}
              />
            </Stack>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description (optional)"
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create Plan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
