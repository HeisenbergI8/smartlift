"use client";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationsIcon from "@mui/icons-material/Notifications";
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

import NotificationPreferencesTable from "../components/NotificationPreferencesTable";
import NotificationsFilters from "../components/NotificationsFilters";
import NotificationsTable from "../components/NotificationsTable";
import { useNotificationActions } from "../hooks/useNotificationActions";

export default function NotificationsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    activeTab,
    setActiveTab,
    typeFilter,
    setTypeFilter,
    readFilter,
    setReadFilter,
    page,
    rowsPerPage,
    filteredNotifications,
    total,
    unreadCount,
    preferences,
    notificationsLoading,
    preferencesLoading,
    isMarkingAll,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleUpdatePreference,
    handlePageChange,
    handleRowsPerPageChange,
  } = useNotificationActions();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0B0E14 0%, #111827 100%)",
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
              <NotificationsIcon
                sx={{ color: "primary.main", fontSize: { xs: 22, sm: 28 } }}
              />
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{ color: "text.primary" }}
              >
                Notifications
              </Typography>
            </Stack>
            {!isMobile && (
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Stay informed about your training, nutrition, and achievements
              </Typography>
            )}
          </Box>

          {activeTab === "notifications" &&
            (isMobile ? (
              <Tooltip title="Mark All as Read">
                <span>
                  <IconButton
                    onClick={handleMarkAllAsRead}
                    disabled={isMarkingAll || unreadCount === 0}
                    aria-label="Mark all notifications as read"
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      "&:hover": { bgcolor: "primary.dark" },
                      "&.Mui-disabled": {
                        bgcolor: "action.disabledBackground",
                      },
                    }}
                  >
                    {isMarkingAll ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <DoneAllIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                startIcon={
                  isMarkingAll ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <DoneAllIcon />
                  )
                }
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll || unreadCount === 0}
              >
                Mark All as Read
              </Button>
            ))}
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
              label={
                unreadCount > 0
                  ? `Notifications (${unreadCount} unread)`
                  : "Notifications"
              }
              value="notifications"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: 0,
              }}
            />
            <Tab
              label="Preferences"
              value="preferences"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: 0,
              }}
            />
          </Tabs>
        </Box>

        {/* Notifications tab */}
        {activeTab === "notifications" && (
          <>
            <Box mb={{ xs: 2, sm: 3 }}>
              <NotificationsFilters
                typeFilter={typeFilter}
                readFilter={readFilter}
                onTypeChange={setTypeFilter}
                onReadFilterChange={setReadFilter}
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
              <NotificationsTable
                notifications={filteredNotifications}
                total={total}
                page={page}
                rowsPerPage={rowsPerPage}
                isLoading={notificationsLoading}
                onMarkAsRead={handleMarkAsRead}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </Paper>
          </>
        )}

        {/* Preferences tab */}
        {activeTab === "preferences" && (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <NotificationPreferencesTable
              preferences={preferences}
              isLoading={preferencesLoading}
              onUpdatePreference={handleUpdatePreference}
            />
          </Paper>
        )}
      </Container>
    </Box>
  );
}
