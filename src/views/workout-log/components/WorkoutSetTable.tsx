"use client";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type { WorkoutSet } from "../types";

type Props = {
  sets: WorkoutSet[];
};

export default function WorkoutSetTable({ sets }: Props) {
  if (sets.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <FitnessCenterIcon sx={{ fontSize: 40, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No sets logged yet
        </Typography>
      </Box>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ textTransform: "uppercase" }}>#</TableCell>
          <TableCell sx={{ textTransform: "uppercase" }}>Exercise</TableCell>
          <TableCell align="center" sx={{ textTransform: "uppercase" }}>
            Reps
          </TableCell>
          <TableCell align="center" sx={{ textTransform: "uppercase" }}>
            Weight (kg)
          </TableCell>
          <TableCell align="center" sx={{ textTransform: "uppercase" }}>
            RPE
          </TableCell>
          <TableCell align="center" sx={{ textTransform: "uppercase" }}>
            Warmup
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sets.map((set) => (
          <TableRow key={set.id} hover>
            <TableCell>{set.setNumber}</TableCell>
            <TableCell>{set.exercise.name}</TableCell>
            <TableCell align="center">{set.reps}</TableCell>
            <TableCell align="center">
              {set.weightKg !== null ? set.weightKg : "—"}
            </TableCell>
            <TableCell align="center">
              {set.rpe !== null ? set.rpe : "—"}
            </TableCell>
            <TableCell align="center">
              {set.isWarmup ? (
                <Chip size="small" color="warning" label="Warmup" />
              ) : (
                "—"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
