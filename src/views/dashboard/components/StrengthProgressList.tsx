"use client";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";

import type { StrengthRecord } from "../types";

type Props = {
  records: StrengthRecord[];
  isLoading: boolean;
};

export default function StrengthProgressList({ records, isLoading }: Props) {
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

  if (records.length === 0) {
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
        <FitnessCenterIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No personal records found.
        </Typography>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Stack spacing={1.5} sx={{ p: 2 }}>
        {records.map((rec) => (
          <Card
            key={rec.exerciseName}
            variant="outlined"
            sx={{ bgcolor: "background.default" }}
          >
            <CardContent sx={{ pb: "12px !important" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ flex: 1, mr: 1 }}
                >
                  {rec.exerciseName}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="primary.main"
                >
                  {rec.currentMaxWeightKg} kg
                </Typography>
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                PR achieved {new Date(rec.achievedAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {["Exercise", "Max Weight (kg)", "Achieved"].map((col) => (
            <TableCell key={col} sx={{ textTransform: "uppercase" }}>
              {col}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {records.map((rec) => (
          <TableRow key={rec.exerciseName} hover>
            <TableCell>{rec.exerciseName}</TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: 700 }}>
              {rec.currentMaxWeightKg} kg
            </TableCell>
            <TableCell>
              {new Date(rec.achievedAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
