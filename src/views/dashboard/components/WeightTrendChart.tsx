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

import type { WeightTrendPeriod, WeightTrendResponse } from "../types";

type Props = {
  trend: WeightTrendResponse | null;
  isLoading: boolean;
  period: WeightTrendPeriod;
  onPeriodChange: (period: WeightTrendPeriod) => void;
};

const PERIOD_OPTIONS: { value: WeightTrendPeriod; label: string }[] = [
  { value: "week", label: "7 days" },
  { value: "month", label: "30 days" },
  { value: "3months", label: "3 months" },
];

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
};

export default function WeightTrendChart({
  trend,
  isLoading,
  period,
  onPeriodChange,
}: Props) {
  const chartData =
    trend?.entries.map((e) => ({ date: e.logDate, weight: e.weightKg })) ?? [];
  const { changeKg, changePct } = trend ?? {};
  const changeColor =
    changeKg !== null && changeKg !== undefined && changeKg < 0
      ? "success.main"
      : "error.main";

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
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        gap={2}
      >
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          Weight Trend
        </Typography>
        <TextField
          label="Period"
          select
          size="small"
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as WeightTrendPeriod)}
          sx={{ width: 140 }}
        >
          {PERIOD_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {changeKg !== null && changeKg !== undefined && (
        <Stack direction="row" gap={4} mb={3} flexWrap="wrap">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Start
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {trend?.startWeight} kg
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Current
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {trend?.endWeight} kg
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Change
            </Typography>
            <Typography variant="body2" fontWeight={600} color={changeColor}>
              {changeKg > 0 ? "+" : ""}
              {changeKg} kg ({changePct}%)
            </Typography>
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
            No weight data for this period.
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
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickFormatter={formatDate}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              unit=" kg"
            />
            <Tooltip
              formatter={(v) => [`${v} kg`, "Weight"]}
              labelFormatter={(label) =>
                typeof label === "string" ? formatDate(label) : String(label)
              }
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
