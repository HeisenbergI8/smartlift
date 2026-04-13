"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HotelIcon from "@mui/icons-material/Hotel";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Controller, useFieldArray } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import type { Control, UseFormWatch } from "react-hook-form";

import { useGetExercisesQuery } from "@/store/services/exerciseApi";
import type { Exercise } from "@/views/exercises/types";
import type { PlanFormValues } from "./WorkoutPlanDialog";

type Props = {
  control: Control<PlanFormValues>;
  watch: UseFormWatch<PlanFormValues>;
};

export default function WorkoutPlanDayForm({ control, watch }: Props) {
  const {
    fields: days,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({ control, name: "days" });

  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const prevLengthRef = useRef(days.length);

  useEffect(() => {
    if (days.length > prevLengthRef.current) {
      const newField = days[days.length - 1];
      setExpandedDays((prev) => new Set([...prev, newField.id]));
    }
    prevLengthRef.current = days.length;
  }, [days]);

  const addDay = () => {
    appendDay({
      dayNumber: days.length + 1,
      name: "",
      isRestDay: false,
      exercises: [],
    });
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1.5}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Training Days
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addDay}
          variant="outlined"
        >
          Add Day
        </Button>
      </Stack>

      {days.length === 0 && (
        <Typography
          variant="body2"
          color="text.disabled"
          sx={{ textAlign: "center", py: 3 }}
        >
          No days added yet. Days are optional — you can add them now or later.
        </Typography>
      )}

      <Stack gap={1}>
        {days.map((day, dayIndex) => (
          <DayRow
            key={day.id}
            dayIndex={dayIndex}
            control={control}
            watch={watch}
            expanded={expandedDays.has(day.id)}
            onToggle={() =>
              setExpandedDays((prev) => {
                const next = new Set(prev);
                if (next.has(day.id)) next.delete(day.id);
                else next.add(day.id);
                return next;
              })
            }
            onRemove={() => removeDay(dayIndex)}
          />
        ))}
      </Stack>

      {days.length > 0 && (
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addDay}
          variant="text"
          fullWidth
          sx={{
            mt: 1,
            border: "1px dashed",
            borderColor: "divider",
            color: "text.secondary",
          }}
        >
          Add Day
        </Button>
      )}
    </Box>
  );
}

type DayRowProps = {
  dayIndex: number;
  control: Control<PlanFormValues>;
  watch: UseFormWatch<PlanFormValues>;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
};

function DayRow({
  dayIndex,
  control,
  watch,
  expanded,
  onToggle,
  onRemove,
}: DayRowProps) {
  const isRestDay = watch(`days.${dayIndex}.isRestDay`);
  const dayName = watch(`days.${dayIndex}.name`);
  const dayNumber = watch(`days.${dayIndex}.dayNumber`);

  const {
    fields: exercises,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({ control, name: `days.${dayIndex}.exercises` });

  const addExercise = () => {
    appendExercise({
      exerciseId: "" as unknown as number,
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

  const summaryLabel = isRestDay
    ? `Day ${dayNumber} — Rest Day`
    : `Day ${dayNumber}${dayName ? ` — ${dayName}` : ""}`;

  return (
    <Stack direction="row" alignItems="flex-start" gap={0.5}>
      <Accordion
        disableGutters
        expanded={expanded}
        onChange={onToggle}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          flex: 1,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" alignItems="center" gap={1}>
            {isRestDay ? (
              <HotelIcon fontSize="small" sx={{ color: "text.disabled" }} />
            ) : (
              <FitnessCenterIcon
                fontSize="small"
                sx={{ color: "primary.main" }}
              />
            )}
            <Typography variant="body2" fontWeight={600}>
              {summaryLabel}
            </Typography>
            {!isRestDay && exercises.length > 0 && (
              <Chip
                size="small"
                label={`${exercises.length} ex`}
                variant="outlined"
              />
            )}
          </Stack>
        </AccordionSummary>

        <AccordionDetails>
          <Stack gap={2}>
            <Stack direction="row" gap={2} alignItems="flex-start">
              <Controller
                name={`days.${dayIndex}.dayNumber`}
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
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                )}
              />

              <Controller
                name={`days.${dayIndex}.name`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Day Name"
                    placeholder="e.g. Anterior A"
                    fullWidth
                    disabled={isRestDay}
                  />
                )}
              />

              <Controller
                name={`days.${dayIndex}.isRestDay`}
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
                    label="Rest"
                  />
                )}
              />
            </Stack>

            {!isRestDay && (
              <>
                <Divider />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" color="text.secondary">
                    Exercises
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addExercise}
                  >
                    Add Exercise
                  </Button>
                </Stack>

                <Stack gap={1.5}>
                  {exercises.map((ex, exIndex) => (
                    <ExerciseRow
                      key={ex.id}
                      dayIndex={dayIndex}
                      exIndex={exIndex}
                      control={control}
                      onRemove={() => removeExercise(exIndex)}
                    />
                  ))}
                  {exercises.length === 0 && (
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ textAlign: "center", py: 1 }}
                    >
                      No exercises yet
                    </Typography>
                  )}
                </Stack>
              </>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Tooltip title="Remove day">
        <IconButton
          size="small"
          color="error"
          onClick={onRemove}
          sx={{ mt: 0.5 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

type ExerciseRowProps = {
  dayIndex: number;
  exIndex: number;
  control: Control<PlanFormValues>;
  onRemove: () => void;
};

function ExerciseRow({
  dayIndex,
  exIndex,
  control,
  onRemove,
}: ExerciseRowProps) {
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
            name={`days.${dayIndex}.exercises.${exIndex}.exerciseId`}
            control={control}
            rules={{ required: "Exercise is required" }}
            render={({ field, fieldState }) => (
              <Autocomplete
                options={exerciseOptions}
                getOptionLabel={(o) => o.name}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                value={
                  exerciseOptions.find((e) => e.id === field.value) ?? null
                }
                onChange={(_e, val) => field.onChange(val?.id ?? null)}
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
            name={`days.${dayIndex}.exercises.${exIndex}.sortOrder`}
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
            name={`days.${dayIndex}.exercises.${exIndex}.targetSets`}
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
            name={`days.${dayIndex}.exercises.${exIndex}.targetRepsMin`}
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
            name={`days.${dayIndex}.exercises.${exIndex}.targetRepsMax`}
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
            name={`days.${dayIndex}.exercises.${exIndex}.targetWeightKg`}
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
            name={`days.${dayIndex}.exercises.${exIndex}.targetRpe`}
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
            name={`days.${dayIndex}.exercises.${exIndex}.restSeconds`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Rest (s)"
                type="number"
                sx={{ width: 90 }}
                placeholder="90"
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
            name={`days.${dayIndex}.exercises.${exIndex}.notes`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Notes"
                placeholder="—"
                sx={{ flex: 1, minWidth: 120 }}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : e.target.value,
                  )
                }
              />
            )}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
