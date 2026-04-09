"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WorkoutConsistencyResponse } from "../types";

type Props = {
  consistency: WorkoutConsistencyResponse | null;
  isLoading: boolean;
};

const formatWeekStart = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
};

export default function WorkoutConsistencyChart({
  consistency,
  isLoading,
}: Props) {
  const chartData =
    consistency?.weeks.map((w) => ({
      week: w.weekStart,
      Planned: w.planned,
      Completed: w.completed,
    })) ?? [];

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
        Workout Consistency
      </Typography>

      {consistency && (
        <Stack direction="row" gap={4} mb={3} flexWrap="wrap">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Overall
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {consistency.overallConsistencyPct}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Current Streak
            </Typography>
            <Stack direction="row" alignItems="center" gap={0.75} mt={0.25}>
              <Typography variant="body2" fontWeight={600}>
                {consistency.currentStreak}
              </Typography>
              <Chip size="small" label="weeks" color="primary" />
            </Stack>
          </Box>
        </Stack>
      )}

      {isLoading ? (
        <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} />
      ) : chartData.length === 0 ? (
        <Box
          sx={{
            height: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No consistency data.
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11 }}
              tickFormatter={formatWeekStart}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              labelFormatter={(label) =>
                typeof label === "string"
                  ? formatWeekStart(label)
                  : String(label)
              }
            />
            <Legend />
            <Bar dataKey="Planned" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
