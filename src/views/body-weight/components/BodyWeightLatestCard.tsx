"use client";

import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { BodyWeightLog, WeightSource } from "../types";
import { formatDate } from "@/libs/formatDate";

type Props = {
  latest: BodyWeightLog | null;
  isLoading: boolean;
};

const SOURCE_COLOR: Record<WeightSource, "primary" | "secondary" | "info"> = {
  smart_scale: "primary",
  coach: "secondary",
  manual: "info",
};

const SOURCE_LABEL: Record<WeightSource, string> = {
  smart_scale: "Smart Scale",
  coach: "Coach",
  manual: "Manual",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.25,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Box>{value}</Box>
    </Box>
  );
}

export default function BodyWeightLatestCard({ latest, isLoading }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
        Latest Weigh-In
      </Typography>

      {isLoading ? (
        <Box>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={44} sx={{ mb: 0.5 }} />
          ))}
        </Box>
      ) : !latest ? (
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
          <MonitorWeightIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography variant="body2" color="text.secondary">
            No weight logged yet. Log your first entry to get started.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Row
            label="Weight"
            value={
              <Typography variant="body2" fontWeight={600}>
                {latest.weightKg} kg
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Date"
            value={
              <Typography variant="body2">
                {formatDate(latest.logDate)}
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Source"
            value={
              <Chip
                size="small"
                color={SOURCE_COLOR[latest.source]}
                label={SOURCE_LABEL[latest.source]}
              />
            }
          />
          {latest.notes && (
            <>
              <Divider />
              <Row
                label="Notes"
                value={
                  <Typography
                    variant="body2"
                    sx={{ maxWidth: 260, textAlign: "right" }}
                  >
                    {latest.notes}
                  </Typography>
                }
              />
            </>
          )}
        </Box>
      )}

      {latest && !isLoading && (latest.updatedAt ?? latest.createdAt) && (
        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Typography variant="caption" color="text.disabled">
            Last updated {formatDate(latest.updatedAt ?? latest.createdAt)}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
}
