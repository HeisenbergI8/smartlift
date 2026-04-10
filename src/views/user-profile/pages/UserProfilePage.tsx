"use client";

import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useGetMeQuery } from "@/store/services/authApi";

import { useUserProfileActions } from "../hooks/useUserProfileActions";
import ProfileForm from "../components/ProfileForm";

import type { UpdateProfileDto } from "../types";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Paper
      sx={{
        flex: 1,
        minWidth: 100,
        p: 2,
        textAlign: "center",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
        {label}
      </Typography>
    </Paper>
  );
}

export default function UserProfilePage() {
  const { data: me } = useGetMeQuery();
  const { profile, isLoading, isError, handleSave, isSaving } =
    useUserProfileActions();

  const displayName = me ? `${me.firstName} ${me.lastName}` : "";
  const email = me?.email ?? "";
  const initials = me
    ? `${me.firstName[0]}${me.lastName[0]}`.toUpperCase()
    : "?";

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

  const stats: Array<{ label: string; value: string }> = [
    profile?.heightCm != null
      ? { label: "Height", value: `${profile.heightCm} cm` }
      : null,
    profile?.weightKg != null
      ? { label: "Weight", value: `${profile.weightKg} kg` }
      : null,
    profile?.age != null ? { label: "Age", value: `${profile.age} yrs` } : null,
    profile?.trainingDaysPerWeek != null
      ? { label: "Training Days", value: `${profile.trainingDaysPerWeek}/wk` }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
        px: { xs: 2, sm: 3 },
        pt: { xs: 3, sm: 4 },
        pb: { xs: 12, sm: 6 },
      }}
    >
      {/* Hero */}
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)",
          border: "1px solid",
          borderColor: "rgba(16,185,129,0.25)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "center", sm: "flex-start" }}
          gap={3}
        >
          <Avatar
            sx={{
              width: 84,
              height: 84,
              fontSize: 32,
              fontWeight: 700,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              flexShrink: 0,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {displayName || "My Profile"}
            </Typography>
            {email && (
              <Typography
                sx={{ fontSize: 14, color: "text.secondary", mb: 1.5 }}
              >
                {email}
              </Typography>
            )}
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              justifyContent={{ xs: "center", sm: "flex-start" }}
            >
              {profile?.fitnessGoal && (
                <Chip
                  size="small"
                  color="primary"
                  label={profile.fitnessGoal.replace(/_/g, " ")}
                />
              )}
              {profile?.activityLevel && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={profile.activityLevel.replace(/_/g, " ")}
                />
              )}
              {me?.accountType && (
                <Chip size="small" variant="outlined" label={me.accountType} />
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Stats row */}
      {stats.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </Stack>
      )}

      {/* Edit form */}
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Edit Profile
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <>
            <Alert severity="warning" sx={{ mb: 2.5 }}>
              Couldn&apos;t load your profile — you can still fill in your
              details below.
            </Alert>
            <ProfileForm onSubmit={handleSave} isLoading={isSaving} />
          </>
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
