"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { NutritionAdherenceResponse } from "../types";

type Props = {
  adherence: NutritionAdherenceResponse | null;
  isLoading: boolean;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
};

export default function NutritionAdherenceChart({
  adherence,
  isLoading,
}: Props) {
  const chartData =
    adherence?.entries.map((e) => ({
      date: e.date,
      adherence: e.adherencePct,
    })) ?? [];

  const avg = adherence?.avgAdherencePct ?? null;
  const avgColor =
    avg !== null && avg >= 90
      ? "success.main"
      : avg !== null && avg >= 80
        ? "warning.main"
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
      <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
        Nutrition Adherence
      </Typography>

      {avg !== null && (
        <Box mb={3}>
          <Typography variant="caption" color="text.secondary">
            Avg Adherence
          </Typography>
          <Typography variant="h5" fontWeight={700} color={avgColor}>
            {avg}%
          </Typography>
        </Box>
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
            No nutrition adherence data.
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
            <YAxis domain={[60, 120]} tick={{ fontSize: 11 }} unit="%" />
            <Tooltip
              formatter={(v) => [`${v}%`, "Adherence"]}
              labelFormatter={(label) =>
                typeof label === "string" ? formatDate(label) : String(label)
              }
            />
            <ReferenceLine
              y={100}
              stroke="#6366f1"
              strokeDasharray="4 4"
              label="Target"
            />
            <Line
              type="monotone"
              dataKey="adherence"
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
