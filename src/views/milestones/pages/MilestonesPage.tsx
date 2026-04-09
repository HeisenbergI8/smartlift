"use client";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";

import MilestonesFilters from "../components/MilestonesFilters";
import MilestonesTable from "../components/MilestonesTable";
import UserMilestonesTable from "../components/UserMilestonesTable";
import { useMilestoneActions } from "../hooks/useMilestoneActions";

export default function MilestonesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    activeTab,
    setActiveTab,
    categoryFilter,
    setCategoryFilter,
    milestones,
    userMilestones,
    earnedIds,
    isLoading,
    userMilestonesLoading,
    isChecking,
    handleCheck,
  } = useMilestoneActions();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
        px: 2,
        pt: { xs: 3, sm: 4 },
        pb: { xs: 10, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Page header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={{ xs: 2, sm: 3 }}
          gap={1}
        >
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              mb={isMobile ? 0 : 0.5}
            >
              <MilitaryTechIcon
                sx={{ color: "warning.main", fontSize: { xs: 22, sm: 28 } }}
              />
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ color: "text.primary" }}
              >
                Milestones
              </Typography>
            </Stack>
            {!isMobile && (
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Track your achievements and unlock new goals
              </Typography>
            )}
          </Box>

          {isMobile ? (
            <Tooltip title="Check for New Milestones">
              <span>
                <IconButton
                  onClick={handleCheck}
                  disabled={isChecking}
                  sx={{
                    bgcolor: "warning.main",
                    color: "warning.contrastText",
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    "&:hover": { bgcolor: "warning.dark" },
                    "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
                  }}
                >
                  {isChecking ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <AutorenewIcon fontSize="small" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              color="warning"
              startIcon={
                isChecking ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <AutorenewIcon />
                )
              }
              onClick={handleCheck}
              disabled={isChecking}
            >
              Check for New Milestones
            </Button>
          )}
        </Stack>

        {/* Tabs */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="inherit"
            indicatorColor="primary"
          >
            <Tab
              label="All Milestones"
              value="catalog"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, minWidth: 0 }}
            />
            <Tab
              label={`My Achievements${userMilestones.length > 0 ? ` (${userMilestones.length})` : ""}`}
              value="achievements"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, minWidth: 0 }}
            />
          </Tabs>
        </Box>

        {/* Catalog tab */}
        {activeTab === "catalog" && (
          <>
            <Box mb={{ xs: 2, sm: 3 }}>
              <MilestonesFilters
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
              />
            </Box>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <MilestonesTable
                milestones={milestones}
                earnedIds={earnedIds}
                isLoading={isLoading}
              />
            </Paper>
          </>
        )}

        {/* My Achievements tab */}
        {activeTab === "achievements" && (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <UserMilestonesTable
              userMilestones={userMilestones}
              isLoading={userMilestonesLoading}
            />
          </Paper>
        )}
      </Container>
    </Box>
  );
}
