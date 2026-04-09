"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

import type { Equipment } from "../types";

type Props = {
  catalog: Equipment[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  isLoading: boolean;
};

export default function EquipmentGrid({
  catalog,
  selectedIds,
  onToggle,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
            <Skeleton variant="rounded" height={120} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (catalog.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          No equipment available.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {catalog.map((item) => {
        const selected = selectedIds.has(item.id);
        return (
          <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                border: 2,
                borderColor: selected ? "primary.main" : "divider",
                transition: "border-color 0.2s",
              }}
            >
              <CardActionArea
                onClick={() => onToggle(item.id)}
                sx={{ height: "100%" }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Checkbox
                      checked={selected}
                      tabIndex={-1}
                      disableRipple
                      size="small"
                      sx={{ p: 0 }}
                    />
                  </Box>
                  {item.description && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {item.description}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
