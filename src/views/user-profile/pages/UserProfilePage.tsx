"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { useUserProfileActions } from "../hooks/useUserProfileActions";
import ProfileForm from "../components/ProfileForm";

import type { UpdateProfileDto } from "../types";

export default function UserProfilePage() {
  const { profile, isLoading, isError, handleSave, isSaving } =
    useUserProfileActions();

  const defaultValues: UpdateProfileDto | undefined = profile
    ? {
        heightCm: profile.heightCm ?? undefined,
        weightKg: profile.weightKg ?? undefined,
        age: profile.age ?? undefined,
        gender: profile.gender ?? undefined,
        fitnessGoal: profile.fitnessGoal ?? undefined,
        activityLevel: profile.activityLevel ?? undefined,
        trainingMethod: profile.trainingMethod ?? undefined,
        trainingDaysPerWeek: profile.trainingDaysPerWeek ?? undefined,
      }
    : undefined;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
        px: 2,
        pt: { xs: 3, sm: 4 },
        pb: { xs: 10, sm: 4 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          maxWidth: 520,
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          My Profile
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <ProfileForm onSubmit={handleSave} isLoading={isSaving} />
        ) : (
          <ProfileForm
            defaultValues={defaultValues}
            onSubmit={handleSave}
            isLoading={isSaving}
          />
        )}
      </Paper>
    </Box>
  );
}
