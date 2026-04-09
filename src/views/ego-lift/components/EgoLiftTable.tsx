"use client";

import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
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

import type { EgoLiftAlert, Severity, TrainingGoal } from "../types";

type Props = {
  alerts: EgoLiftAlert[];
  isLoading: boolean;
  onDismiss: (id: number) => void;
};

const SEVERITY_COLOR: Record<Severity, "warning" | "error"> = {
  warning: "warning",
  critical: "error",
};

const TRAINING_GOAL_LABEL: Record<TrainingGoal, string> = {
  strength: "Strength",
  hypertrophy: "Hypertrophy",
  endurance: "Endurance",
};

export default function EgoLiftTable({ alerts, isLoading, onDismiss }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading) {
    return (
      <Box sx={{ px: 2 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={52} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (alerts.length === 0) {
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
        <WarningAmberIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No active ego-lift alerts. Keep lifting smart!
        </Typography>
      </Box>
    );
  }

  const paginated = alerts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const pagination = (
    <TablePagination
      component="div"
      count={alerts.length}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
      onPageChange={(_, newPage) => setPage(newPage)}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
    />
  );

  if (isMobile) {
    return (
      <>
        <Stack spacing={1.5} sx={{ p: 2 }}>
          {paginated.map((alert) => (
            <Card
              key={alert.id}
              variant="outlined"
              sx={{ bgcolor: "background.default" }}
            >
              <CardContent sx={{ pb: "12px !important" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {alert.exercise.name}
                  </Typography>
                  <Tooltip title="Dismiss alert">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => onDismiss(alert.id)}
                      aria-label={`Dismiss alert for ${alert.exercise.name}`}
                    >
                      <CheckCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack direction="row" gap={0.75} flexWrap="wrap" mb={1.5}>
                  <Chip
                    size="small"
                    color={SEVERITY_COLOR[alert.severity]}
                    label={alert.severity}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={TRAINING_GOAL_LABEL[alert.trainingGoal]}
                  />
                </Stack>

                <Stack direction="row" gap={3} mb={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Prev weight
                    </Typography>
                    <Typography variant="body2">
                      {alert.previousWeightKg} kg
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Flagged weight
                    </Typography>
                    <Typography
                      variant="body2"
                      color="error.main"
                      fontWeight={600}
                    >
                      {alert.flaggedWeightKg} kg
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Prev reps
                    </Typography>
                    <Typography variant="body2">
                      {alert.previousReps}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Flagged reps
                    </Typography>
                    <Typography
                      variant="body2"
                      color="error.main"
                      fontWeight={600}
                    >
                      {alert.flaggedReps}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 1 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {alert.message}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </Typography>
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
            <TableCell sx={{ textTransform: "uppercase" }}>Exercise</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Severity</TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Goal</TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Prev Weight
            </TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Flagged Weight
            </TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Prev Reps
            </TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Flagged Reps
            </TableCell>
            <TableCell sx={{ textTransform: "uppercase" }}>Message</TableCell>
            <TableCell align="right" sx={{ textTransform: "uppercase" }}>
              Date
            </TableCell>
            <TableCell align="center" sx={{ textTransform: "uppercase" }}>
              Dismiss
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((alert) => (
            <TableRow key={alert.id} hover>
              <TableCell>{alert.exercise.name}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={SEVERITY_COLOR[alert.severity]}
                  label={alert.severity}
                />
              </TableCell>
              <TableCell>{TRAINING_GOAL_LABEL[alert.trainingGoal]}</TableCell>
              <TableCell align="right">{alert.previousWeightKg} kg</TableCell>
              <TableCell align="right">{alert.flaggedWeightKg} kg</TableCell>
              <TableCell align="right">{alert.previousReps}</TableCell>
              <TableCell align="right">{alert.flaggedReps}</TableCell>
              <TableCell
                sx={{ maxWidth: 280, whiteSpace: "normal", lineHeight: 1.4 }}
              >
                {alert.message}
              </TableCell>
              <TableCell align="right">
                {new Date(alert.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Dismiss alert">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => onDismiss(alert.id)}
                    aria-label={`Dismiss alert for ${alert.exercise.name}`}
                  >
                    <CheckCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination}
    </>
  );
}
