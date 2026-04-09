"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import { clearAccessToken } from "@/libs/authToken";
import { useGetMeQuery } from "@/store/services/authApi";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllAsReadMutation,
} from "@/store/services/notificationsApi";
import type { Notification } from "@/views/notifications/types";

const PATH_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/workout-plans": "Workout Plans",
  "/workout-log": "Workout Log",
  "/exercises": "Exercises",
  "/equipment": "Equipment",
  "/muscle-priority": "Muscle Focus",
  "/progression": "Progression",
  "/personal-records": "Personal Records",
  "/ego-lift": "Ego-Lift",
  "/body-weight": "Body Weight",
  "/nutrition": "Nutrition",
  "/milestones": "Milestones",
  "/notifications": "Notifications",
  "/profile": "Profile",
};

function getPageTitle(pathname: string): string {
  const match = Object.keys(PATH_LABELS).find(
    (key) => pathname === key || pathname.startsWith(key + "/"),
  );
  return match ? PATH_LABELS[match] : "SmartLift";
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Notifications popover ────────────────────────────────────────────────────
type BellProps = { onViewAll: () => void };

function NotificationsBell({ onViewAll }: BellProps) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const { data: unreadData } = useGetUnreadCountQuery();
  const unreadCount = unreadData?.count ?? 0;

  const { data: listData } = useGetNotificationsQuery(
    { page: 1, limit: 5 },
    { skip: !anchor },
  );
  const [markAllAsRead, { isLoading: marking }] = useMarkAllAsReadMutation();

  const notifications: Notification[] = listData?.data ?? [];
  const open = Boolean(anchor);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={(e) => setAnchor(e.currentTarget)}
          size="medium"
        >
          <Badge
            badgeContent={unreadCount}
            max={99}
            invisible={unreadCount === 0}
            color="error"
          >
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              maxHeight: 420,
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography fontWeight={700} fontSize={14}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              disabled={marking}
              onClick={() => markAllAsRead()}
              sx={{ fontSize: 12, textTransform: "none", py: 0 }}
            >
              Mark all read
            </Button>
          )}
        </Stack>

        {notifications.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <Typography fontSize={13} color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding sx={{ flex: 1, overflowY: "auto" }}>
            {notifications.map((n, idx) => (
              <Box key={n.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: n.isRead ? "transparent" : "rgba(16,185,129,0.05)",
                    "&:hover": { bgcolor: "action.hover" },
                    cursor: "default",
                  }}
                >
                  <ListItemText
                    primary={n.title}
                    secondary={formatRelativeTime(n.createdAt)}
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: n.isRead ? 400 : 600,
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{ fontSize: 11 }}
                  />
                  {!n.isRead && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        mt: 1,
                        ml: 1,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </ListItem>
                {idx < notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}

        <Divider />
        <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
          <Button
            size="small"
            fullWidth
            onClick={() => {
              setAnchor(null);
              onViewAll();
            }}
            sx={{ fontSize: 12, textTransform: "none" }}
          >
            View all notifications
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ─── Profile menu ─────────────────────────────────────────────────────────────
function ProfileMenu() {
  const router = useRouter();
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const { data: me } = useGetMeQuery();
  const initials = me
    ? `${me.firstName[0]}${me.lastName[0]}`.toUpperCase()
    : null;

  const handleClose = () => setAnchor(null);

  const goToProfile = () => {
    handleClose();
    router.push("/profile");
  };

  const handleLogout = () => {
    handleClose();
    clearAccessToken();
    router.replace("/login");
  };

  return (
    <>
      <Tooltip title="Account">
        <IconButton
          color="inherit"
          onClick={(e) => setAnchor(e.currentTarget)}
          size="medium"
        >
          {initials ? (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: 700,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              {initials}
            </Avatar>
          ) : (
            <AccountCircleIcon />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 180, mt: 0.5 } } }}
      >
        {me && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
              {me.firstName} {me.lastName}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              {me.email}
            </Typography>
          </Box>
        )}
        {me && <Divider />}
        <MenuItem onClick={goToProfile} sx={{ gap: 1.5, fontSize: 14 }}>
          <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} />
          View Profile
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{ gap: 1.5, fontSize: 14, color: "error.main" }}
        >
          <LogoutIcon fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

// ─── Main header ──────────────────────────────────────────────────────────────
export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Brand — only visible on mobile (sidebar has it on sm+) */}
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FitnessCenterIcon sx={{ fontSize: 16, color: "#000" }} />
          </Box>
          <Typography fontWeight={800} fontSize={15} noWrap>
            SmartLift
          </Typography>
        </Stack>

        {/* Page title */}
        <Typography
          fontWeight={600}
          fontSize={{ xs: 14, sm: 16 }}
          noWrap
          sx={{ flex: 1, color: "text.primary" }}
        >
          {getPageTitle(pathname)}
        </Typography>

        {/* Actions */}
        <NotificationsBell onViewAll={() => router.push("/notifications")} />
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
}
