"use client";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { DashboardOverview } from "../types";

type Props = {
  overview: DashboardOverview | null;
  isLoading: boolean;
};

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
};

function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Box sx={{ color: "primary.main" }}>{icon}</Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography variant="h5" fontWeight={700} sx={{ color: "text.primary" }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

function SkeletonCard() {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2.5,
      }}
    >
      <Skeleton height={16} width={80} sx={{ mb: 1 }} />
      <Skeleton height={36} width={120} />
    </Paper>
  );
}

export default function DashboardOverviewCards({ overview, isLoading }: Props) {
  const gridSx = {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
    },
    gap: 2,
    mb: 4,
  };

  if (isLoading) {
    return (
      <Box sx={gridSx}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </Box>
    );
  }

  const cards: StatCardProps[] = [
    {
      icon: <MonitorWeightIcon />,
      label: "Body Weight",
      value: overview?.latestWeight
        ? `${overview.latestWeight.weightKg} kg`
        : "—",
      sub: overview?.latestWeight
        ? `as of ${new Date(overview.latestWeight.logDate).toLocaleDateString()}`
        : "No data",
    },
    {
      icon: <FitnessCenterIcon />,
      label: "Active Plan",
      value: overview?.activePlan?.name ?? "—",
      sub: overview?.activePlan
        ? `${overview.activePlan.daysPerWeek} days / week`
        : "No active plan",
    },
    {
      icon: <RestaurantMenuIcon />,
      label: "Calorie Target",
      value: overview?.activeRecommendation
        ? `${overview.activeRecommendation.dailyCaloriesKcal.toLocaleString()} kcal`
        : "—",
      sub: overview?.activeRecommendation
        ? `${overview.activeRecommendation.proteinG} g protein`
        : "No recommendation",
    },
    {
      icon: <EventAvailableIcon />,
      label: "Consistency Score",
      value: overview?.latestSnapshot
        ? `${overview.latestSnapshot.consistencyScore}%`
        : "—",
      sub: overview?.latestSnapshot
        ? `Streak: ${overview.latestSnapshot.weeklyStreak} weeks`
        : "No snapshot",
    },
    {
      icon: <NotificationsIcon />,
      label: "Unread Notifications",
      value: String(overview?.unreadNotifications ?? 0),
      sub: "pending alerts",
    },
    {
      icon: <WarningAmberIcon />,
      label: "Ego-Lift Alerts",
      value: String(overview?.activeEgoAlerts ?? 0),
      sub: "active alerts",
    },
  ];

  return (
    <Box sx={gridSx}>
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </Box>
  );
}
