"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import type React from "react";

import type { WorkoutPlan } from "../types";

const GOAL_COLOR_MAP: Record<
  string,
  "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"
> = {
  strength: "error",
  hypertrophy: "primary",
  endurance: "info",
  general: "success",
};

const SOURCE_CONFIG: Record<
  string,
  {
    label: string;
    color: "default" | "secondary" | "warning";
    icon: React.ReactNode;
  }
> = {
  user: {
    label: "Self-created",
    color: "default",
    icon: <PersonIcon sx={{ fontSize: 14 }} />,
  },
  system: {
    label: "System",
    color: "secondary",
    icon: <SmartToyIcon sx={{ fontSize: 14 }} />,
  },
};

type WorkoutPlanCardProps = {
  plan: WorkoutPlan;
  isActivePlan: boolean;
  onEdit: (plan: WorkoutPlan) => void;
  onDelete: (id: number) => void;
  onActivate: (id: number) => void;
  isActivating: boolean;
};

export default function WorkoutPlanCard({
  plan,
  isActivePlan,
  onEdit,
  onDelete,
  onActivate,
  isActivating,
}: WorkoutPlanCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/workout-plans/${plan.id}`);
  };

  const goalLabel = plan.trainingGoal.replace(/_/g, " ");

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 6 },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }} onClick={handleCardClick}>
        <Stack direction="row" alignItems="flex-start" gap={1} mb={1}>
          <CalendarMonthIcon sx={{ color: "text.secondary", mt: 0.25 }} />
          <Typography variant="h6" fontWeight={600} lineHeight={1.2}>
            {plan.name}
          </Typography>
        </Stack>

        <Stack direction="row" gap={1} flexWrap="wrap" mb={1.5}>
          <Chip
            size="small"
            color={plan.isActive ? "success" : "default"}
            variant={plan.isActive ? "filled" : "outlined"}
            label={plan.isActive ? "Active" : "Inactive"}
          />
          <Chip
            size="small"
            color={GOAL_COLOR_MAP[plan.trainingGoal] ?? "default"}
            label={goalLabel.charAt(0).toUpperCase() + goalLabel.slice(1)}
          />
          {(() => {
            const src = SOURCE_CONFIG[plan.source];
            return src ? (
              <Chip
                size="small"
                color={src.color}
                variant="outlined"
                icon={src.icon as React.ReactElement}
                label={src.label}
              />
            ) : null;
          })()}
        </Stack>

        {plan.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            mb={1.5}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {plan.description}
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Days/week
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            {plan.daysPerWeek}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Duration
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            {plan.durationWeeks} weeks
          </Typography>
        </Box>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: "space-between", px: 1.5 }}>
        <Tooltip title={isActivePlan ? "Already active" : "Activate"}>
          <span>
            <IconButton
              size="small"
              color={isActivePlan ? "success" : "default"}
              disabled={isActivePlan || isActivating}
              onClick={() => onActivate(plan.id)}
            >
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Stack direction="row">
          <Tooltip title="Edit plan">
            <IconButton size="small" onClick={() => onEdit(plan)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete plan">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(plan.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
}
