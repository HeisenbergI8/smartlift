"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";

import type { UpdateProfileDto } from "../types";

const profileSchema = v.object({
  heightCm: v.optional(
    v.pipe(
      v.number(),
      v.minValue(50, "Min 50 cm"),
      v.maxValue(300, "Max 300 cm"),
    ),
  ),
  weightKg: v.optional(
    v.pipe(
      v.number(),
      v.minValue(20, "Min 20 kg"),
      v.maxValue(500, "Max 500 kg"),
    ),
  ),
  age: v.optional(
    v.pipe(
      v.number(),
      v.minValue(13, "Min age 13"),
      v.maxValue(120, "Max age 120"),
    ),
  ),
  gender: v.optional(v.picklist(["male", "female", "other"])),
  fitnessGoal: v.optional(
    v.picklist([
      "lose_weight",
      "build_muscle",
      "maintain",
      "improve_strength",
      "improve_endurance",
    ]),
  ),
  activityLevel: v.optional(
    v.picklist([
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extremely_active",
    ]),
  ),
  trainingMethod: v.optional(
    v.picklist(["free_weights", "machines", "bodyweight", "mixed"]),
  ),
  trainingDaysPerWeek: v.optional(
    v.pipe(v.number(), v.minValue(1, "Min 1 day"), v.maxValue(7, "Max 7 days")),
  ),
});

type Props = {
  defaultValues?: UpdateProfileDto;
  onSubmit: (data: UpdateProfileDto) => void;
  isLoading: boolean;
};

export default function ProfileForm({
  defaultValues,
  onSubmit,
  isLoading,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileDto>({
    resolver: valibotResolver(profileSchema),
    defaultValues: defaultValues ?? {},
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            {...register("heightCm", { valueAsNumber: true })}
            label="Height (cm)"
            type="number"
            fullWidth
            error={!!errors.heightCm}
            helperText={errors.heightCm?.message}
          />
          <TextField
            {...register("weightKg", { valueAsNumber: true })}
            label="Weight (kg)"
            type="number"
            fullWidth
            error={!!errors.weightKg}
            helperText={errors.weightKg?.message}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            {...register("age", { valueAsNumber: true })}
            label="Age"
            type="number"
            fullWidth
            error={!!errors.age}
            helperText={errors.age?.message}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select {...field} value={field.value ?? ""} label="Gender">
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Box>

        <Controller
          name="fitnessGoal"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.fitnessGoal}>
              <InputLabel>Fitness Goal</InputLabel>
              <Select {...field} value={field.value ?? ""} label="Fitness Goal">
                <MenuItem value="lose_weight">Lose Weight</MenuItem>
                <MenuItem value="build_muscle">Build Muscle</MenuItem>
                <MenuItem value="maintain">Maintain</MenuItem>
                <MenuItem value="improve_strength">Improve Strength</MenuItem>
                <MenuItem value="improve_endurance">Improve Endurance</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="activityLevel"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.activityLevel}>
              <InputLabel>Activity Level</InputLabel>
              <Select
                {...field}
                value={field.value ?? ""}
                label="Activity Level"
              >
                <MenuItem value="sedentary">Sedentary</MenuItem>
                <MenuItem value="lightly_active">Lightly Active</MenuItem>
                <MenuItem value="moderately_active">Moderately Active</MenuItem>
                <MenuItem value="very_active">Very Active</MenuItem>
                <MenuItem value="extremely_active">Extremely Active</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Controller
            name="trainingMethod"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.trainingMethod}>
                <InputLabel>Training Method</InputLabel>
                <Select
                  {...field}
                  value={field.value ?? ""}
                  label="Training Method"
                >
                  <MenuItem value="free_weights">Free Weights</MenuItem>
                  <MenuItem value="machines">Machines</MenuItem>
                  <MenuItem value="bodyweight">Bodyweight</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <TextField
            {...register("trainingDaysPerWeek", { valueAsNumber: true })}
            label="Training Days / Week"
            type="number"
            fullWidth
            error={!!errors.trainingDaysPerWeek}
            helperText={errors.trainingDaysPerWeek?.message}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 1 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save Profile"
          )}
        </Button>
      </Stack>
    </form>
  );
}
