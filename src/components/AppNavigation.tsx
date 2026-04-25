"use client";

import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import ScaleIcon from "@mui/icons-material/Scale";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";
import { clearAccessToken } from "@/libs/authToken";
import { useGetMeQuery } from "@/store/services/authApi";

type NavItem = { label: string; path: string; icon: ReactNode };
type NavGroup = { label: string; items: NavItem[] };
type NavProps = {
  pathname: string;
  onNavigate: (p: string) => void;
  onLogout: () => void;
};

const MINI_W = 72;
const FULL_W = 260;

const GROUPS: NavGroup[] = [
  {
    label: "Training",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <SpaceDashboardIcon fontSize="small" />,
      },
      {
        label: "Plans",
        path: "/workout-plans",
        icon: <EventNoteIcon fontSize="small" />,
      },
      {
        label: "Log",
        path: "/workout-log",
        icon: <AssignmentIcon fontSize="small" />,
      },
      {
        label: "Exercises",
        path: "/exercises",
        icon: <DirectionsRunIcon fontSize="small" />,
      },
      {
        label: "Equipment",
        path: "/equipment",
        icon: <FitnessCenterIcon fontSize="small" />,
      },
      {
        label: "Muscle Focus",
        path: "/muscle-priority",
        icon: <TrackChangesIcon fontSize="small" />,
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        label: "Progression",
        path: "/progression",
        icon: <ShowChartIcon fontSize="small" />,
      },
      {
        label: "Records",
        path: "/personal-records",
        icon: <EmojiEventsIcon fontSize="small" />,
      },
      {
        label: "Ego-Lift",
        path: "/ego-lift",
        icon: <GppMaybeIcon fontSize="small" />,
      },
      {
        label: "Body Weight",
        path: "/body-weight",
        icon: <ScaleIcon fontSize="small" />,
      },
      {
        label: "Nutrition",
        path: "/nutrition",
        icon: <LocalDiningIcon fontSize="small" />,
      },
      {
        label: "Milestones",
        path: "/milestones",
        icon: <MilitaryTechIcon fontSize="small" />,
      },
    ],
  },
];

function matchActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(path + "/");
}

// ─── Mobile bottom bar ────────────────────────────────────────────────────────
function MobileNav({ pathname, onNavigate, onLogout }: NavProps) {
  const computeIdx = (p: string) => {
    const idx = GROUPS.findIndex((g) =>
      g.items.some((i) => matchActive(p, i.path)),
    );
    return idx !== -1 ? idx : 0;
  };
  const [groupIdx, setGroupIdx] = useState(() => computeIdx(pathname));
  const [prevPathname, setPrevPathname] = useState(pathname);
  const touchX = useRef(0);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setGroupIdx(computeIdx(pathname));
  }

  const group = GROUPS[groupIdx];

  return (
    <Paper
      elevation={4}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const delta = touchX.current - e.changedTouches[0].clientX;
        if (delta > 50) setGroupIdx((i) => Math.min(i + 1, GROUPS.length - 1));
        if (delta < -50) setGroupIdx((i) => Math.max(i - 1, 0));
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, pt: 0.75 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{ flex: 1, justifyContent: "center" }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 10,
              textTransform: "uppercase",
              color: "text.secondary",
              letterSpacing: 1,
            }}
          >
            {group.label}
          </Typography>
          {GROUPS.map((_, i) => (
            <ButtonBase
              key={i}
              onClick={() => setGroupIdx(i)}
              sx={{
                width: i === groupIdx ? 18 : 6,
                height: 6,
                borderRadius: 999,
                bgcolor: i === groupIdx ? "primary.main" : "action.disabled",
                transition: "width 0.2s, background-color 0.2s",
                minWidth: 0,
              }}
            />
          ))}
        </Stack>
        <IconButton
          size="small"
          onClick={onLogout}
          sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
        >
          <LogoutIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-around"
        sx={{ px: 1, pb: 1.5, pt: 0.5 }}
      >
        {group.items.map((item) => {
          const active = matchActive(pathname, item.path);
          return (
            <ButtonBase
              key={item.path}
              onClick={() => onNavigate(item.path)}
              sx={{
                flexDirection: "column",
                alignItems: "center",
                gap: 0.25,
                borderRadius: 2,
                px: 0.5,
                py: 0.5,
                minWidth: 52,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: active ? "rgba(16,185,129,0.15)" : "transparent",
                  color: active ? "primary.main" : "text.secondary",
                  boxShadow: active ? "0 0 8px rgba(16,185,129,0.4)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: active ? 700 : 400,
                  color: active ? "primary.main" : "text.secondary",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Stack>
    </Paper>
  );
}

// ─── Desktop / tablet sidebar ─────────────────────────────────────────────────
function SidebarNav({
  pathname,
  onNavigate,
  onLogout,
  mini,
}: NavProps & { mini: boolean }) {
  const { data: me } = useGetMeQuery();
  const displayName = me ? `${me.firstName} ${me.lastName}` : "";
  const email = me?.email ?? "";
  const initials = me
    ? `${me.firstName[0]}${me.lastName[0]}`.toUpperCase()
    : "?";
  const w = mini ? MINI_W : FULL_W;
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: w,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: w,
          boxSizing: "border-box",
          overflowX: "hidden",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          transition: "width 0.2s",
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: mini ? "center" : "flex-start",
          px: mini ? 0 : 2,
          gap: 1,
        }}
      >
        <Image
          src="/logo.png"
          alt="SmartLift logo"
          width={mini ? 36 : 48}
          height={mini ? 36 : 48}
          style={{ width: "auto", height: mini ? 36 : 48 }}
        />
        {!mini && (
          <Typography fontWeight={800} fontSize={15} noWrap>
            SmartLift
          </Typography>
        )}
      </Toolbar>
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {GROUPS.map((group) => (
          <Box key={group.label} sx={{ mb: 1 }}>
            {!mini && (
              <Typography
                sx={{
                  px: 2,
                  pt: 1.5,
                  pb: 0.5,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "text.disabled",
                }}
              >
                {group.label}
              </Typography>
            )}
            <List dense disablePadding>
              {group.items.map((item) => {
                const active = matchActive(pathname, item.path);
                const btn = (
                  <ListItemButton
                    selected={active}
                    onClick={() => onNavigate(item.path)}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      mb: 0.25,
                      justifyContent: mini ? "center" : "flex-start",
                      pl: mini ? 0 : 1.5,
                      borderLeft: "2px solid",
                      borderColor: active ? "primary.main" : "transparent",
                      "&.Mui-selected": { bgcolor: "rgba(16,185,129,0.1)" },
                      "&.Mui-selected:hover": {
                        bgcolor: "rgba(16,185,129,0.15)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: mini ? 0 : 36,
                        color: active ? "primary.main" : "text.secondary",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!mini && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: active ? 600 : 400,
                        }}
                      />
                    )}
                  </ListItemButton>
                );
                return mini ? (
                  <Tooltip key={item.path} title={item.label} placement="right">
                    {btn}
                  </Tooltip>
                ) : (
                  <Box key={item.path}>{btn}</Box>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}>
        {mini ? (
          <Tooltip title={`${displayName} — Logout`} placement="right">
            <ListItemButton
              onClick={onLogout}
              sx={{ borderRadius: 2, justifyContent: "center" }}
            >
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
            </ListItemButton>
          </Tooltip>
        ) : (
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ px: 1, py: 0.75 }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontSize: 14,
                fontWeight: 700,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "text.secondary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {email}
              </Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton
                size="small"
                onClick={onLogout}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "error.main" },
                  flexShrink: 0,
                }}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function AppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const smUp = useMediaQuery("(min-width:600px)");
  const mdUp = useMediaQuery("(min-width:900px)");

  const onNavigate = (path: string) => router.push(path);
  const onLogout = () => {
    clearAccessToken();
    router.replace("/login");
  };

  if (smUp) {
    return (
      <SidebarNav
        pathname={pathname}
        onNavigate={onNavigate}
        onLogout={onLogout}
        mini={!mdUp}
      />
    );
  }
  return (
    <MobileNav
      pathname={pathname}
      onNavigate={onNavigate}
      onLogout={onLogout}
    />
  );
}
