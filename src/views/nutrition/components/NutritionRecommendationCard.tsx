"use client";

import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { NutritionRecommendation, NutritionSource } from "../types";

type Props = {
  active: NutritionRecommendation | null;
  isLoading: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  onAdd: () => void;
};

const SOURCE_COLOR: Record<NutritionSource, "primary" | "secondary" | "info"> =
  {
    system: "primary",
    coach: "secondary",
    manual: "info",
  };

const SOURCE_LABEL: Record<NutritionSource, string> = {
  system: "Smart",
  coach: "Manual",
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

export default function NutritionRecommendationCard({
  active,
  isLoading,
  isGenerating,
  onGenerate,
  onAdd,
}: Props) {
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={1}
        flexWrap="wrap"
      >
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          Active Recommendation
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={
              isGenerating ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <AutoFixHighIcon />
              )
            }
            onClick={onGenerate}
            disabled={isGenerating || isLoading}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Generate Smart
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            disabled={isLoading}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Add Manual
          </Button>
        </Stack>
      </Stack>

      {isLoading ? (
        <Box>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={44} sx={{ mb: 0.5 }} />
          ))}
        </Box>
      ) : !active ? (
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
          <RestaurantMenuIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography variant="body2" color="text.secondary">
            No active nutrition recommendation. Click Generate Smart or Add
            Manual to get started.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Row
            label="Daily Calories"
            value={
              <Typography variant="body2" fontWeight={600}>
                {active.dailyCaloriesKcal.toLocaleString()} kcal
              </Typography>
            }
          />
          <Divider />
          <Row
            label="Protein"
            value={<Typography variant="body2">{active.proteinG} g</Typography>}
          />
          <Divider />
          <Row
            label="Carbohydrates"
            value={
              <Typography variant="body2">{active.carbohydratesG} g</Typography>
            }
          />
          <Divider />
          <Row
            label="Fats"
            value={<Typography variant="body2">{active.fatsG} g</Typography>}
          />
          <Divider />
          <Row
            label="Source"
            value={
              <Chip
                size="small"
                color={SOURCE_COLOR[active.source]}
                label={SOURCE_LABEL[active.source]}
              />
            }
          />
          <Divider />
          <Row
            label="Effective From"
            value={
              <Typography variant="body2">
                {new Date(active.effectiveFrom).toLocaleDateString()}
              </Typography>
            }
          />
          {active.notes && (
            <>
              <Divider />
              <Row
                label="Notes"
                value={
                  <Typography
                    variant="body2"
                    sx={{ maxWidth: 260, textAlign: "right" }}
                  >
                    {active.notes}
                  </Typography>
                }
              />
            </>
          )}
        </Box>
      )}
    </Paper>
  );
}
