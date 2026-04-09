"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HistoryIcon from "@mui/icons-material/History";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { clearAccessToken } from "@/libs/authToken";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Equipment", path: "/equipment", icon: <FitnessCenterIcon /> },
  { label: "Exercises", path: "/exercises", icon: <ListAltIcon /> },
  {
    label: "Muscle Focus",
    path: "/muscle-priority",
    icon: <TrackChangesIcon />,
  },
  {
    label: "Workout Plans",
    path: "/workout-plans",
    icon: <CalendarMonthIcon />,
  },
  { label: "Workout Log", path: "/workout-log", icon: <HistoryIcon /> },
  {
    label: "Personal Records",
    path: "/personal-records",
    icon: <EmojiEventsIcon />,
  },
  { label: "Ego-Lift Alerts", path: "/ego-lift", icon: <WarningAmberIcon /> },
  { label: "Progression", path: "/progression", icon: <TrendingUpIcon /> },
  { label: "Nutrition", path: "/nutrition", icon: <RestaurantMenuIcon /> },
  { label: "Body Weight", path: "/body-weight", icon: <MonitorWeightIcon /> },
  { label: "Milestones", path: "/milestones", icon: <MilitaryTechIcon /> },
  {
    label: "Notifications",
    path: "/notifications",
    icon: <NotificationsIcon />,
  },
  { label: "Profile", path: "/profile", icon: <PersonIcon /> },
] as const;

const MOBILE_PRIMARY_PATHS = [
  "/dashboard",
  "/workout-log",
  "/workout-plans",
  "/profile",
] as const;
const MOBILE_PRIMARY = NAV_ITEMS.filter((item) =>
  (MOBILE_PRIMARY_PATHS as readonly string[]).includes(item.path),
);
const MOBILE_SECONDARY = NAV_ITEMS.filter(
  (item) => !(MOBILE_PRIMARY_PATHS as readonly string[]).includes(item.path),
);

export default function AppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMini = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [moreOpen, setMoreOpen] = useState(false);

  const handleNavigate = (path: string) => {
    router.push(path);
    setMoreOpen(false);
  };

  const handleLogout = () => {
    clearAccessToken();
    router.replace("/login");
  };

  // ── Mobile: bottom nav + "More" bottom drawer ──────────────────────────────
  if (isMobile) {
    const activeIndex = MOBILE_PRIMARY.findIndex(
      (item) => pathname === item.path,
    );
    const moreActive = MOBILE_SECONDARY.some(
      (item) => pathname === item.path || pathname.startsWith(item.path + "/"),
    );

    return (
      <>
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
          elevation={3}
        >
          <BottomNavigation
            value={moreActive ? 4 : activeIndex === -1 ? false : activeIndex}
            onChange={(_, newValue) => {
              if (newValue === 4) {
                setMoreOpen((prev) => !prev);
              } else {
                handleNavigate(MOBILE_PRIMARY[newValue as 0 | 1 | 2 | 3].path);
              }
            }}
            sx={{ bgcolor: "background.paper" }}
          >
            {MOBILE_PRIMARY.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={item.icon}
                sx={{ "&.Mui-selected": { color: "primary.main" } }}
              />
            ))}
            <BottomNavigationAction
              label="More"
              icon={<MoreHorizIcon />}
              sx={{ "&.Mui-selected": { color: "primary.main" } }}
            />
          </BottomNavigation>
        </Paper>

        <Drawer
          anchor="bottom"
          open={moreOpen}
          onClose={() => setMoreOpen(false)}
          PaperProps={{
            sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, pb: 2 },
          }}
        >
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              More
            </Typography>
          </Box>
          <List dense>
            {MOBILE_SECONDARY.map((item) => {
              const isActive =
                pathname === item.path || pathname.startsWith(item.path + "/");
              return (
                <ListItemButton
                  key={item.path}
                  selected={isActive}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    "&.Mui-selected": {
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      color: "primary.main",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? "primary.main" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
            <Divider sx={{ my: 1 }} />
            <ListItemButton
              onClick={handleLogout}
              sx={{ borderRadius: 1, mx: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItemButton>
          </List>
        </Drawer>
      </>
    );
  }

  // ── Tablet: 64px mini sidebar · Desktop: 240px full sidebar ───────────────
  const sidebarWidth = isMini ? 64 : 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sidebarWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Brand header */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          px: isMini ? 0 : 2,
          height: 64,
          gap: 1.5,
          justifyContent: isMini ? "center" : "flex-start",
          flexShrink: 0,
        }}
      >
        <FitnessCenterIcon sx={{ color: "primary.main", flexShrink: 0 }} />
        {!isMini && (
          <Typography variant="h6" noWrap sx={{ color: "text.primary" }}>
            SmartLift
          </Typography>
        )}
      </Stack>

      <Divider />

      {/* Nav items */}
      <List sx={{ flex: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(item.path + "/");

          const button = (
            <ListItemButton
              selected={isActive}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mx: 0.5,
                borderRadius: 1,
                minHeight: 44,
                justifyContent: isMini ? "center" : "flex-start",
                "&.Mui-selected": {
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  color: "primary.main",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
                "&:hover": { bgcolor: "rgba(16, 185, 129, 0.06)" },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isMini ? 0 : 36,
                  mr: isMini ? 0 : 1.5,
                  justifyContent: "center",
                  color: isActive ? "primary.main" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isMini && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: isActive ? 600 : 400,
                    noWrap: true,
                  }}
                />
              )}
            </ListItemButton>
          );

          return isMini ? (
            <Tooltip key={item.path} title={item.label} placement="right" arrow>
              <span>{button}</span>
            </Tooltip>
          ) : (
            <Box key={item.path}>{button}</Box>
          );
        })}
      </List>

      <Divider />

      {/* Sign out */}
      <Box sx={{ py: 1 }}>
        {isMini ? (
          <Tooltip title="Sign out" placement="right" arrow>
            <span>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  mx: 0.5,
                  borderRadius: 1,
                  minHeight: 44,
                  justifyContent: "center",
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.06)" },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
              </ListItemButton>
            </span>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 0.5,
              borderRadius: 1,
              minHeight: 44,
              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.06)" },
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 36, mr: 1.5, color: "text.secondary" }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sign out"
              primaryTypographyProps={{
                variant: "body2",
                color: "text.secondary",
                noWrap: true,
              }}
            />
          </ListItemButton>
        )}
      </Box>
    </Drawer>
  );
}
