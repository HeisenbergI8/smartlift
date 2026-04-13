"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HotelIcon from "@mui/icons-material/Hotel";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";

import type { WorkoutPlanDay } from "../types";

type WorkoutPlanDayAccordionProps = {
  day: WorkoutPlanDay;
  defaultExpanded?: boolean;
};

export default function WorkoutPlanDayAccordion({
  day,
  defaultExpanded = false,
}: WorkoutPlanDayAccordionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const summaryLabel = day.isRestDay
    ? `Day ${day.dayNumber} — Rest Day`
    : `Day ${day.dayNumber}${day.name ? ` — ${day.name}` : ""}`;

  const sortedExercises = [...day.exercises].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Typography fontWeight={600}>{summaryLabel}</Typography>
          {day.isRestDay && (
            <Chip
              size="small"
              icon={<HotelIcon />}
              label="Rest"
              color="default"
              variant="outlined"
            />
          )}
          {!day.isRestDay && day.exercises.length > 0 && (
            <Chip
              size="small"
              label={`${day.exercises.length} exercises`}
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        {day.isRestDay || day.exercises.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 2, py: 1.5 }}
          >
            {day.isRestDay
              ? "Recovery day — no exercises scheduled."
              : "No exercises added yet."}
          </Typography>
        ) : isMobile ? (
          <Stack spacing={0} divider={<Divider />}>
            {sortedExercises.map((ex) => {
              const repsLabel =
                ex.targetRepsMin === ex.targetRepsMax
                  ? String(ex.targetRepsMin)
                  : `${ex.targetRepsMin}–${ex.targetRepsMax}`;
              const details = [
                `${ex.targetSets}×${repsLabel}`,
                ex.targetWeightKg != null ? `${ex.targetWeightKg} kg` : null,
                ex.targetRpe != null ? `@${ex.targetRpe} RPE` : null,
                ex.restSeconds != null ? `${ex.restSeconds}s rest` : null,
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <Box key={ex.id} sx={{ px: 2, py: 1.25 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {ex.exercise.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {details}
                  </Typography>
                  {ex.notes && (
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ display: "block" }}
                    >
                      {ex.notes}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ textTransform: "uppercase" }}>
                  Exercise
                </TableCell>
                <TableCell align="center" sx={{ textTransform: "uppercase" }}>
                  Sets
                </TableCell>
                <TableCell align="center" sx={{ textTransform: "uppercase" }}>
                  Reps
                </TableCell>
                <TableCell align="center" sx={{ textTransform: "uppercase" }}>
                  Weight
                </TableCell>
                <TableCell align="center" sx={{ textTransform: "uppercase" }}>
                  RPE
                </TableCell>
                <TableCell align="center" sx={{ textTransform: "uppercase" }}>
                  Rest
                </TableCell>
                <TableCell sx={{ textTransform: "uppercase" }}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedExercises.map((ex) => (
                <TableRow key={ex.id} hover>
                  <TableCell>{ex.exercise.name}</TableCell>
                  <TableCell align="center">{ex.targetSets}</TableCell>
                  <TableCell align="center">
                    {ex.targetRepsMin === ex.targetRepsMax
                      ? ex.targetRepsMin
                      : `${ex.targetRepsMin}–${ex.targetRepsMax}`}
                  </TableCell>
                  <TableCell align="center">
                    {ex.targetWeightKg != null
                      ? `${ex.targetWeightKg} kg`
                      : "—"}
                  </TableCell>
                  <TableCell align="center">
                    {ex.targetRpe != null ? `@${ex.targetRpe}` : "—"}
                  </TableCell>
                  <TableCell align="center">
                    {ex.restSeconds != null ? `${ex.restSeconds}s` : "—"}
                  </TableCell>
                  <TableCell>{ex.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
