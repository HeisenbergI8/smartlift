"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import type {
  CreateWorkoutPlanDto,
  CreateWorkoutPlanDayDto,
  TrainingGoal,
  UpdateWorkoutPlanDto,
  WorkoutPlan,
} from "../types";
import WorkoutPlanDayForm from "./WorkoutPlanDayForm";

const TRAINING_GOALS: { value: TrainingGoal; label: string }[] = [
  { value: "strength", label: "Strength" },
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "endurance", label: "Endurance" },
  { value: "general", label: "General" },
];

export type PlanFormValues = {
  name: string;
  description: string;
  trainingGoal: TrainingGoal;
  daysPerWeek: number;
  durationWeeks: number;
  startedAt: string;
  days: CreateWorkoutPlanDayDto[];
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
    watch,
    formState: { errors },
  } = useForm<PlanFormValues>({
    defaultValues: {
      name: "",
      description: "",
      trainingGoal: "general",
      daysPerWeek: 3,
      durationWeeks: 8,
      startedAt: "",
      days: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editTarget?.name ?? "",
        description: editTarget?.description ?? "",
        trainingGoal: editTarget?.trainingGoal ?? "general",
        daysPerWeek: editTarget?.daysPerWeek ?? 3,
        durationWeeks: editTarget?.durationWeeks ?? 8,
        startedAt: editTarget?.startedAt?.split("T")[0] ?? "",
        days: [],
      });
    }
  }, [open, editTarget, reset]);

  const onSubmit = (values: PlanFormValues) => {
    if (isEdit && editTarget) {
      onUpdate(editTarget.id, {
        name: values.name,
        description: values.description || undefined,
        trainingGoal: values.trainingGoal,
        daysPerWeek: values.daysPerWeek,
        durationWeeks: values.durationWeeks,
        startedAt: values.startedAt || undefined,
      });
    } else {
      const days: CreateWorkoutPlanDayDto[] = values.days.map((d) => ({
        dayNumber: d.dayNumber,
        name: d.name || undefined,
        isRestDay: d.isRestDay,
        exercises: d.isRestDay
          ? []
          : (d.exercises ?? []).map((ex, i) => ({
              exerciseId: ex.exerciseId,
              sortOrder: ex.sortOrder ?? i + 1,
              targetSets: ex.targetSets,
              targetRepsMin: ex.targetRepsMin,
              targetRepsMax: ex.targetRepsMax,
              targetWeightKg: ex.targetWeightKg,
              targetRpe: ex.targetRpe,
              restSeconds: ex.restSeconds,
              notes: ex.notes || undefined,
            })),
      }));

      onCreate({
        name: values.name,
        description: values.description || undefined,
        trainingGoal: values.trainingGoal,
        daysPerWeek: values.daysPerWeek,
        durationWeeks: values.durationWeeks,
        startedAt: values.startedAt || undefined,
        days,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: "90vh" } }}
    >
      <DialogTitle>
        {isEdit ? "Edit Workout Plan" : "New Workout Plan"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack gap={2.5}>
            {/* Plan info */}
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
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
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

            <Stack direction="row" gap={2} flexWrap="wrap">
              <Controller
                name="daysPerWeek"
                control={control}
                rules={{
                  required: "Required",
                  min: { value: 1, message: "Min 1" },
                  max: { value: 7, message: "Max 7" },
                }}
                render={({ field }) => (
                  <FormControl
                    sx={{ minWidth: 140 }}
                    error={!!errors.daysPerWeek}
                  >
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
                    sx={{ minWidth: 160 }}
                    error={!!errors.durationWeeks}
                    helperText={errors.durationWeeks?.message}
                    slotProps={{ htmlInput: { min: 1 } }}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                )}
              />

              <Controller
                name="startedAt"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Start Date"
                    type="date"
                    sx={{ minWidth: 170 }}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { style: { colorScheme: "dark" } },
                    }}
                  />
                )}
              />
            </Stack>

            {/* Days — create only */}
            {!isEdit && (
              <>
                <Divider />
                <WorkoutPlanDayForm control={control} watch={watch} />
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={14} /> : undefined
            }
          >
            {isSubmitting
              ? isEdit
                ? "Saving…"
                : "Creating…"
              : isEdit
                ? "Save Changes"
                : "Create Plan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
