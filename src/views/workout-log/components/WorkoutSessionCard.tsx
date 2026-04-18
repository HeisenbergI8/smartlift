"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import type { SessionStatus, WorkoutSession } from "../types";

const STATUS_COLOR_MAP: Record<
  SessionStatus,
  "warning" | "success" | "default"
> = {
  in_progress: "warning",
  completed: "success",
  skipped: "default",
};

const STATUS_LABEL: Record<SessionStatus, string> = {
  in_progress: "In Progress",
  completed: "Completed",
  skipped: "Skipped",
};

type Props = {
  session: WorkoutSession;
  planDayName?: string | null;
  onDelete: (id: number) => void;
};

export default function WorkoutSessionCard({
  session,
  planDayName,
  onDelete,
}: Props) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/workout-log/${session.id}`);
  };

  const formattedDate = new Date(session.startedAt).toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric", year: "numeric" },
  );

  const formattedTime = new Date(session.startedAt).toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit" },
  );

  const uniqueExercises = [
    ...new Map(
      session.sets.map((s) => [s.exerciseId, s.exercise.name]),
    ).values(),
  ];

  const exercisePreview =
    uniqueExercises.length === 0
      ? null
      : uniqueExercises.slice(0, 3).join(" · ") +
        (uniqueExercises.length > 3 ? ` +${uniqueExercises.length - 3}` : "");

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
          <FitnessCenterIcon sx={{ color: "text.secondary", mt: 0.25 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} lineHeight={1.2}>
              {planDayName ?? formattedDate}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {planDayName ? formattedDate : formattedTime}
            </Typography>
          </Box>
          <Tooltip title="Delete session">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
              aria-label="Delete session"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack
          direction="row"
          gap={1}
          flexWrap="wrap"
          mb={exercisePreview ? 1 : 0}
        >
          <Chip
            size="small"
            color={STATUS_COLOR_MAP[session.status]}
            label={STATUS_LABEL[session.status]}
          />
          {session.durationMinutes !== null && (
            <Chip
              size="small"
              variant="outlined"
              label={`${session.durationMinutes} min`}
            />
          )}
        </Stack>

        {exercisePreview && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            {exercisePreview}
          </Typography>
        )}

        {session.notes && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {session.notes}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
