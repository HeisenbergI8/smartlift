"use client";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WeeklyAverage } from "../types";
import { formatDate } from "@/libs/formatDate";

type Props = {
  weeklyAverages: WeeklyAverage[];
  isLoading: boolean;
  weeksFilter: number;
  onWeeksChange: (weeks: number) => void;
};

const WEEKS_OPTIONS = [4, 8, 12, 24] as const;

export default function WeeklyAveragesChart({
  weeklyAverages,
  isLoading,
  weeksFilter,
  onWeeksChange,
}: Props) {
  const chartData = weeklyAverages.map((w) => ({
    label: w.weekStart,
    avg: w.avgWeightKg,
    logs: w.entryCount,
  }));

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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        gap={2}
        flexWrap="wrap"
      >
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          Weekly Weight Average
        </Typography>
        <TextField
          label="Period"
          select
          size="small"
          value={weeksFilter}
          onChange={(e) => onWeeksChange(Number(e.target.value))}
          sx={{ width: 120 }}
        >
          {WEEKS_OPTIONS.map((w) => (
            <MenuItem key={w} value={w}>
              {w} weeks
            </MenuItem>
          ))}
        </TextField>
      </Stack>

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
            No data available for the selected period.
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
              tickFormatter={(v: string) =>
                new Date(v).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }}
              tickFormatter={(v: number) => `${v} kg`}
              width={60}
            />
            <Tooltip
              formatter={(value) =>
                value !== undefined
                  ? [`${value} kg`, "Avg Weight"]
                  : ["—", "Avg Weight"]
              }
              labelFormatter={(label) =>
                typeof label === "string"
                  ? `Week of ${formatDate(label)}`
                  : String(label)
              }
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
              }}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: "#10b981" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
