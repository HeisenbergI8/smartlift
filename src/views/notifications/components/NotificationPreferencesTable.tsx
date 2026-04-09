"use client";

import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";

import type {
  NotificationPreference,
  NotificationType,
  UpdateNotificationPrefsDto,
} from "../types";

type Props = {
  preferences: NotificationPreference[];
  isLoading: boolean;
  onUpdatePreference: (dto: UpdateNotificationPrefsDto) => void;
};

const TYPE_LABELS: Record<NotificationType, string> = {
  workout_reminder: "Workout Reminder",
  missed_session: "Missed Session",
  nutrition_reminder: "Nutrition Reminder",
  ego_lift_warning: "Ego-Lift Warning",
  progression_update: "Progression Update",
  milestone: "Milestone",
  general: "General",
};

const TYPE_DESCRIPTIONS: Record<NotificationType, string> = {
  workout_reminder: "Remind you when it's time to log a training session",
  missed_session: "Alert you when a scheduled workout session was not logged",
  nutrition_reminder: "Nudge you to log your daily meals and nutrition",
  ego_lift_warning: "Warn you when a dangerous weight jump is detected",
  progression_update: "Inform you when your working weights are adjusted",
  milestone: "Celebrate when you unlock a new achievement milestone",
  general: "General announcements and system updates",
};

const TYPE_COLOR: Record<
  NotificationType,
  "default" | "primary" | "secondary" | "warning" | "error" | "info" | "success"
> = {
  workout_reminder: "primary",
  missed_session: "warning",
  nutrition_reminder: "info",
  ego_lift_warning: "error",
  progression_update: "secondary",
  milestone: "success",
  general: "default",
};

const NOTIFICATION_TYPES: NotificationType[] = [
  "workout_reminder",
  "missed_session",
  "nutrition_reminder",
  "ego_lift_warning",
  "progression_update",
  "milestone",
  "general",
];

export default function NotificationPreferencesTable({
  preferences,
  isLoading,
  onUpdatePreference,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getIsEnabled = (type: NotificationType): boolean => {
    const pref = preferences.find((p) => p.type === type);
    return pref?.isEnabled ?? true;
  };

  const handleToggle = (type: NotificationType, currentValue: boolean) => {
    onUpdatePreference({ type, isEnabled: !currentValue });
  };

  if (isLoading) {
    return (
      <Box sx={{ px: 2 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} height={52} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Stack spacing={1.5} sx={{ p: 2 }}>
        {NOTIFICATION_TYPES.map((type) => {
          const isEnabled = getIsEnabled(type);
          return (
            <Card
              key={type}
              variant="outlined"
              sx={{
                bgcolor: "background.default",
                opacity: isEnabled ? 1 : 0.6,
              }}
            >
              <CardContent sx={{ pb: "12px !important" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0.75}
                >
                  <Stack direction="row" gap={1} alignItems="center">
                    <Chip
                      size="small"
                      color={TYPE_COLOR[type]}
                      label={TYPE_LABELS[type]}
                    />
                  </Stack>
                  <Switch
                    checked={isEnabled}
                    onChange={() => handleToggle(type, isEnabled)}
                    size="small"
                    inputProps={{
                      "aria-label": `Toggle ${TYPE_LABELS[type]} notifications`,
                    }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {TYPE_DESCRIPTIONS[type]}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ textTransform: "uppercase" }}>Type</TableCell>
          <TableCell sx={{ textTransform: "uppercase" }}>Description</TableCell>
          <TableCell align="center" sx={{ textTransform: "uppercase" }}>
            Status
          </TableCell>
          <TableCell align="center" sx={{ textTransform: "uppercase" }}>
            Enabled
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {NOTIFICATION_TYPES.map((type) => {
          const isEnabled = getIsEnabled(type);
          return (
            <TableRow key={type} hover sx={{ opacity: isEnabled ? 1 : 0.6 }}>
              <TableCell>
                <Chip
                  size="small"
                  color={TYPE_COLOR[type]}
                  label={TYPE_LABELS[type]}
                />
              </TableCell>
              <TableCell
                sx={{ maxWidth: 360, whiteSpace: "normal", lineHeight: 1.4 }}
              >
                {TYPE_DESCRIPTIONS[type]}
              </TableCell>
              <TableCell align="center">
                {isEnabled ? (
                  <Chip size="small" color="success" label="On" />
                ) : (
                  <Chip
                    size="small"
                    variant="outlined"
                    label="Off"
                    icon={<NotificationsOffIcon />}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEnabled}
                      onChange={() => handleToggle(type, isEnabled)}
                      inputProps={{
                        "aria-label": `Toggle ${TYPE_LABELS[type]} notifications`,
                      }}
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
