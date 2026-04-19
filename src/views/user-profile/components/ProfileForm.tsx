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
    v.picklist(["lose_weight", "gain_muscle", "maintain"]),
  ),
  activityLevel: v.optional(
    v.picklist([
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extra_active",
    ]),
  ),
  trainingMethod: v.optional(
    v.picklist(["weight_training", "bodyweight", "hybrid"]),
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
                <MenuItem value="gain_muscle">Gain Muscle</MenuItem>
                <MenuItem value="maintain">Maintain</MenuItem>
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
                <MenuItem value="sedentary">
                  <Box>
                    <Box fontWeight={500}>Sedentary</Box>
                    <Box
                      sx={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        whiteSpace: "normal",
                      }}
                    >
                      Desk job or mostly sitting — little to no exercise
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="lightly_active">
                  <Box>
                    <Box fontWeight={500}>Lightly Active</Box>
                    <Box
                      sx={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        whiteSpace: "normal",
                      }}
                    >
                      Light exercise 1–3 days/week or a job with some walking
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="moderately_active">
                  <Box>
                    <Box fontWeight={500}>Moderately Active</Box>
                    <Box
                      sx={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        whiteSpace: "normal",
                      }}
                    >
                      Moderate exercise 3–5 days/week with an active daily
                      routine
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="very_active">
                  <Box>
                    <Box fontWeight={500}>Very Active</Box>
                    <Box
                      sx={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        whiteSpace: "normal",
                      }}
                    >
                      Hard training 6–7 days/week or a physically demanding job
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="extra_active">
                  <Box>
                    <Box fontWeight={500}>Extra Active</Box>
                    <Box
                      sx={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        whiteSpace: "normal",
                      }}
                    >
                      Athlete-level training twice a day or very heavy manual
                      labour
                    </Box>
                  </Box>
                </MenuItem>
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
                  <MenuItem value="weight_training">Weight Training</MenuItem>
                  <MenuItem value="bodyweight">Bodyweight</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
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
