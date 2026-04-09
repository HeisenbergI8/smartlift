"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

import type { PriorityLevel, UserMusclePriority } from "../types";

type Props = {
  priorities: UserMusclePriority[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (priority: UserMusclePriority) => void;
  onDelete: (muscleGroupId: number) => void;
};

const priorityColorMap: Record<
  PriorityLevel,
  "default" | "primary" | "warning"
> = {
  low: "default",
  normal: "primary",
  high: "warning",
};

const COLUMNS = [
  "Muscle Group",
  "Region",
  "Priority",
  "Imbalance",
  "Notes",
  "",
];

export default function MusclePriorityTable({
  priorities,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const headerBar = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: "text.primary" }}>
        {priorities.length}{" "}
        {priorities.length === 1 ? "priority" : "priorities"} set
      </Typography>
      <Button
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        onClick={onAdd}
      >
        Add Priority
      </Button>
    </Box>
  );

  if (isLoading) {
    return (
      <Box>
        {headerBar}
        <Box sx={{ px: 1 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={72} sx={{ mb: 1 }} />
          ))}
        </Box>
      </Box>
    );
  }

  const emptyState = (
    <Box
      sx={{
        textAlign: "center",
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TrackChangesIcon
        sx={{ fontSize: 40, color: "text.secondary", opacity: 0.5 }}
      />
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        No muscle priorities set. Add one to track your focus areas.
      </Typography>
    </Box>
  );

  if (isMobile) {
    return (
      <Box>
        {headerBar}
        {priorities.length === 0 ? (
          emptyState
        ) : (
          <Stack spacing={1.5}>
            {priorities.map((p) => (
              <Card
                key={p.id}
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
                      {p.muscleGroup.name}
                    </Typography>
                    <Stack direction="row" gap={0.5}>
                      <IconButton
                        size="small"
                        aria-label={`Edit ${p.muscleGroup.name} priority`}
                        onClick={() => onEdit(p)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label={`Delete ${p.muscleGroup.name} priority`}
                        onClick={() => onDelete(p.muscleGroupId)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Stack direction="row" gap={0.75} flexWrap="wrap" mb={1}>
                    <Chip
                      size="small"
                      label={p.muscleGroup.bodyRegion.replace("_", " ")}
                      sx={{ textTransform: "capitalize", fontSize: "0.7rem" }}
                    />
                    <Chip
                      size="small"
                      color={priorityColorMap[p.priorityLevel]}
                      label={p.priorityLevel}
                      sx={{ textTransform: "capitalize" }}
                    />
                    {p.hasImbalance ? (
                      <Chip size="small" color="error" label="Imbalance" />
                    ) : (
                      <Chip size="small" variant="outlined" label="Balanced" />
                    )}
                  </Stack>

                  {p.notes && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {headerBar}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ bgcolor: "background.paper" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              {COLUMNS.map((label, i) => (
                <TableCell
                  key={i}
                  sx={{
                    textTransform: "uppercase",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {priorities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>{emptyState}</TableCell>
              </TableRow>
            ) : (
              priorities.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {p.muscleGroup.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={p.muscleGroup.bodyRegion.replace("_", " ")}
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "0.7rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={priorityColorMap[p.priorityLevel]}
                      label={p.priorityLevel}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    {p.hasImbalance ? (
                      <Chip size="small" color="error" label="Flagged" />
                    ) : (
                      <Chip size="small" variant="outlined" label="None" />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 220,
                      color: "text.secondary",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.notes ?? "—"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      aria-label={`Edit ${p.muscleGroup.name} priority`}
                      onClick={() => onEdit(p)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label={`Delete ${p.muscleGroup.name} priority`}
                      onClick={() => onDelete(p.muscleGroupId)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
