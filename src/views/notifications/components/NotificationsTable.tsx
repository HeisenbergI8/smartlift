"use client";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";

import type { Notification, NotificationType } from "../types";

type Props = {
  notifications: Notification[];
  total: number;
  page: number;
  rowsPerPage: number;
  isLoading: boolean;
  onMarkAsRead: (id: number) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
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

export default function NotificationsTable({
  notifications,
  total,
  page,
  rowsPerPage,
  isLoading,
  onMarkAsRead,
  onPageChange,
  onRowsPerPageChange,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading) {
    return (
      <Box sx={{ px: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={52} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <NotificationsNoneIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No notifications match your filters.
        </Typography>
      </Box>
    );
  }

  const pagination = (
    <TablePagination
      component="div"
      count={total}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      onRowsPerPageChange={(e) => {
        onRowsPerPageChange(parseInt(e.target.value, 10));
      }}
    />
  );

  if (isMobile) {
    return (
      <>
        <Stack spacing={1.5} sx={{ p: 2 }}>
          {notifications.map((n) => (
            <Card
              key={n.id}
              variant="outlined"
              sx={{
                bgcolor: "background.default",
                borderLeftWidth: 3,
                borderLeftColor: n.isRead ? "divider" : "primary.main",
                opacity: n.isRead ? 0.75 : 1,
              }}
            >
              <CardContent sx={{ pb: "12px !important" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={n.isRead ? 400 : 700}
                    sx={{ flex: 1, pr: 1 }}
                  >
                    {n.title}
                  </Typography>
                  {!n.isRead && (
                    <Tooltip title="Mark as read">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onMarkAsRead(n.id)}
                        aria-label={`Mark "${n.title}" as read`}
                      >
                        <MarkEmailReadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>

                <Stack direction="row" gap={0.75} flexWrap="wrap" mb={1.5}>
                  <Chip
                    size="small"
                    color={TYPE_COLOR[n.type]}
                    label={TYPE_LABELS[n.type]}
                  />
                  {n.isRead ? (
                    <Chip size="small" variant="outlined" label="Read" />
                  ) : (
                    <Chip
                      size="small"
                      color="primary"
                      variant="outlined"
                      label="Unread"
                    />
                  )}
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, lineHeight: 1.5 }}
                >
                  {n.body}
                </Typography>

                <Divider sx={{ mb: 1 }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.disabled">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </Typography>
                  {n.isRead && n.readAt && (
                    <Typography variant="caption" color="text.disabled">
                      Read {new Date(n.readAt).toLocaleDateString()}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
        {pagination}
      </>
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ textTransform: "uppercase" }}>Title</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Type</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Message</TableCell>
            <TableCell align="center" sx={{ textTransform: "uppercase" }}>
              Status
            </TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Date
            </TableCell>
            <TableCell align="center" sx={{ textTransform: "uppercase" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications.map((n) => (
            <TableRow key={n.id} hover sx={{ opacity: n.isRead ? 0.7 : 1 }}>
              <TableCell
                sx={{
                  fontWeight: n.isRead ? 400 : 700,
                  maxWidth: 200,
                  whiteSpace: "normal",
                }}
              >
                {n.title}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={TYPE_COLOR[n.type]}
                  label={TYPE_LABELS[n.type]}
                />
              </TableCell>
              <TableCell
                sx={{ maxWidth: 320, whiteSpace: "normal", lineHeight: 1.4 }}
              >
                {n.body}
              </TableCell>
              <TableCell align="center">
                {n.isRead ? (
                  <Chip size="small" variant="outlined" label="Read" />
                ) : (
                  <Chip size="small" color="primary" label="Unread" />
                )}
              </TableCell>
              <TableCell align="right">
                {new Date(n.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell align="center">
                {!n.isRead ? (
                  <Tooltip title="Mark as read">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onMarkAsRead(n.id)}
                      aria-label={`Mark "${n.title}" as read`}
                    >
                      <MarkEmailReadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <DoneAllIcon
                    fontSize="small"
                    sx={{ color: "text.disabled" }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination}
    </>
  );
}
