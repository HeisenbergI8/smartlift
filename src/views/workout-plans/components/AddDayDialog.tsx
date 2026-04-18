"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useGetExercisesQuery } from "@/store/services/exerciseApi";
import type { Exercise } from "@/views/exercises/types";
import type {
  CreateWorkoutPlanDayDto,
  CreateWorkoutPlanDayExerciseDto,
} from "../types";

type ExerciseFormRow = Omit<CreateWorkoutPlanDayExerciseDto, "exerciseId"> & {
  exerciseId: number | "";
};

type AddDayFormValues = {
  dayNumber: number;
  name: string;
  isRestDay: boolean;
  exercises: ExerciseFormRow[];
};

type Props = {
  open: boolean;
  nextDayNumber: number;
  isSubmitting: boolean;
  onClose: () => void;
  onAdd: (dto: CreateWorkoutPlanDayDto) => void;
};

export default function AddDayDialog({
  open,
  nextDayNumber,
  isSubmitting,
  onClose,
  onAdd,
}: Props) {
  const { control, handleSubmit, reset, watch } = useForm<AddDayFormValues>({
    defaultValues: {
      dayNumber: nextDayNumber,
      name: "",
      isRestDay: false,
      exercises: [],
    },
  });

  const isRestDay = watch("isRestDay");

  const {
    fields: exercises,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({ control, name: "exercises" });

  useEffect(() => {
    if (open) {
      reset({
        dayNumber: nextDayNumber,
        name: "",
        isRestDay: false,
        exercises: [],
      });
    }
  }, [open, nextDayNumber, reset]);

  const addExercise = () => {
    appendExercise({
      exerciseId: "",
      sortOrder: exercises.length + 1,
      targetSets: 3,
      targetRepsMin: 8,
      targetRepsMax: 12,
      targetWeightKg: undefined,
      targetRpe: undefined,
      restSeconds: 90,
      notes: "",
    });
  };

  const onSubmit = (values: AddDayFormValues) => {
    const dto: CreateWorkoutPlanDayDto = {
      dayNumber: values.dayNumber,
      name: values.name || undefined,
      isRestDay: values.isRestDay,
      exercises: values.isRestDay
        ? []
        : values.exercises
            .filter((ex) => ex.exerciseId !== "")
            .map((ex, i) => ({
              exerciseId: ex.exerciseId as number,
              sortOrder: ex.sortOrder ?? i + 1,
              targetSets: ex.targetSets,
              targetRepsMin: ex.targetRepsMin,
              targetRepsMax: ex.targetRepsMax,
              targetWeightKg: ex.targetWeightKg,
              targetRpe: ex.targetRpe,
              restSeconds: ex.restSeconds,
              notes: ex.notes || undefined,
            })),
    };
    onAdd(dto);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Training Day</DialogTitle>
      <DialogContent dividers>
        <Stack
          component="form"
          id="add-day-form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2.5}
          sx={{ pt: 0.5 }}
        >
          {/* Day metadata */}
          <Stack
            direction="row"
            gap={2}
            alignItems="flex-start"
            flexWrap="wrap"
          >
            <Controller
              name="dayNumber"
              control={control}
              rules={{
                required: "Required",
                min: { value: 1, message: "Min 1" },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Day #"
                  type="number"
                  sx={{ width: 90 }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  slotProps={{ htmlInput: { min: 1 } }}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Day Name"
                  placeholder="e.g. Push A"
                  sx={{ flex: 1, minWidth: 180 }}
                  disabled={isRestDay}
                />
              )}
            />

            <Controller
              name="isRestDay"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{ whiteSpace: "nowrap", mt: 0.5 }}
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Rest Day"
                />
              )}
            />
          </Stack>

          {/* Exercises section */}
          {!isRestDay && (
            <>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Exercises
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addExercise}
                  variant="outlined"
                >
                  Add Exercise
                </Button>
              </Stack>

              {exercises.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  No exercises yet — you can add them now or later.
                </Typography>
              )}

              <Stack gap={1.5}>
                {exercises.map((ex, exIndex) => (
                  <ExerciseRow
                    key={ex.id}
                    exIndex={exIndex}
                    control={control}
                    onRemove={() => removeExercise(exIndex)}
                  />
                ))}
              </Stack>
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
          form="add-day-form"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={14} /> : undefined}
        >
          {isSubmitting ? "Adding…" : "Add Day"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type ExerciseRowProps = {
  exIndex: number;
  control: ReturnType<typeof useForm<AddDayFormValues>>["control"];
  onRemove: () => void;
};

function ExerciseRow({ exIndex, control, onRemove }: ExerciseRowProps) {
  const [inputValue, setInputValue] = useState("");

  const { data: exercisesRes, isLoading: isLoadingExercises } =
    useGetExercisesQuery({
      page: 1,
      limit: 100,
      search: inputValue || undefined,
    });
  const exerciseOptions: Exercise[] = exercisesRes?.data ?? [];

  return (
    <Box
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "action.hover",
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Exercise #{exIndex + 1}
        </Typography>
        <Tooltip title="Remove exercise">
          <IconButton size="small" color="error" onClick={onRemove}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack gap={1.5}>
        <Stack
          direction="row"
          gap={1.5}
          flexWrap="wrap"
          alignItems="flex-start"
        >
          <Controller
            name={`exercises.${exIndex}.exerciseId`}
            control={control}
            rules={{ required: "Exercise is required" }}
            render={({ field, fieldState }) => (
              <Autocomplete
                options={exerciseOptions}
                getOptionLabel={(o) => (typeof o === "object" ? o.name : "")}
                isOptionEqualToValue={(o, v) => o.id === (v as Exercise).id}
                value={
                  exerciseOptions.find((e) => e.id === field.value) ?? null
                }
                onChange={(_e, val) => field.onChange(val?.id ?? "")}
                inputValue={inputValue}
                onInputChange={(_e, val) => setInputValue(val)}
                loading={isLoadingExercises}
                filterOptions={(x) => x}
                sx={{ minWidth: 220 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Exercise"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingExercises && (
                              <CircularProgress color="inherit" size={16} />
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
              />
            )}
          />

          <Controller
            name={`exercises.${exIndex}.sortOrder`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Order"
                type="number"
                sx={{ width: 80 }}
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            )}
          />

          <Controller
            name={`exercises.${exIndex}.targetSets`}
            control={control}
            rules={{
              required: "Required",
              min: { value: 1, message: "Min 1" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Sets"
                type="number"
                sx={{ width: 80 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            )}
          />

          <Controller
            name={`exercises.${exIndex}.targetRepsMin`}
            control={control}
            rules={{
              required: "Required",
              min: { value: 1, message: "Min 1" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Reps Min"
                type="number"
                sx={{ width: 95 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            )}
          />

          <Controller
            name={`exercises.${exIndex}.targetRepsMax`}
            control={control}
            rules={{
              required: "Required",
              min: { value: 1, message: "Min 1" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Reps Max"
                type="number"
                sx={{ width: 95 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
        </Stack>

        <Stack direction="row" gap={1.5} flexWrap="wrap">
          <Controller
            name={`exercises.${exIndex}.targetWeightKg`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Weight (kg)"
                type="number"
                sx={{ width: 110 }}
                placeholder="—"
                slotProps={{ htmlInput: { min: 0, step: 0.5 } }}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === ""
                      ? undefined
                      : parseFloat(e.target.value),
                  )
                }
              />
            )}
          />

          <Controller
            name={`exercises.${exIndex}.targetRpe`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="RPE"
                type="number"
                sx={{ width: 80 }}
                placeholder="—"
                slotProps={{ htmlInput: { min: 1, max: 10, step: 0.5 } }}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === ""
                      ? undefined
                      : parseFloat(e.target.value),
                  )
                }
              />
            )}
          />

          <Controller
            name={`exercises.${exIndex}.restSeconds`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Rest (sec)"
                type="number"
                sx={{ width: 100 }}
                placeholder="—"
                slotProps={{ htmlInput: { min: 0 } }}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === ""
                      ? undefined
                      : parseInt(e.target.value, 10),
                  )
                }
              />
            )}
          />

          <Controller
            name={`exercises.${exIndex}.notes`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Notes"
                sx={{ flex: 1, minWidth: 160 }}
                placeholder="—"
              />
            )}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
