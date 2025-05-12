import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Box,
  Avatar,
  Button,
  Typography,
  useTheme,
  styled,
  alpha,
} from "@mui/material";
import {
  Home,
  Info,
  Settings,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle,
  Logout,
  People,
  Bookmark,
  Description,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SideMenuProps {
  onMenuItemClick: (path: string) => void;
}

// Стилизация Drawer с градиентом и тенью
const CustomDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${alpha(
      theme.palette.secondary.main,
      0.8
    )} 100%)`,
    color: theme.palette.primary.contrastText,
    border: "none",
    boxShadow: theme.shadows[8],
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    boxSizing: "border-box",
    marginTop: 64,
    height: "calc(100vh - 64px)",
  },
}));

// Акцентная полоска для активного пункта
const ActiveIndicator = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  top: 8,
  bottom: 8,
  width: 4,
  borderRadius: 2,
  background: theme.palette.secondary.main,
  transition: "opacity 0.3s",
  opacity: 1,
}));

const SideMenu: React.FC<SideMenuProps> = ({ onMenuItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const drawerWidth = open ? 260 : 80;

  const BASE_MENU_ITEMS =
    user && !isAdmin
      ? [
          { text: "Главная", icon: <Info />, path: "/" },
          { text: "Все объекты", icon: <Home />, path: "/objects-for-users" },
        ]
      : [{ text: "Главная", icon: <Info />, path: "/" }];

  const ADMIN_MENU_ITEMS = [
    { text: "Редактировать объекты", icon: <Settings />, path: "/objects" },
    { text: "Все пользователи", icon: <People />, path: "/all-users" },
    { text: "Бронирования", icon: <Bookmark />, path: "/reservations" },
    { text: "Договоры", icon: <Description />, path: "/contracts" },
  ];

  const menuItems = [
    ...BASE_MENU_ITEMS,
    ...(isAdmin ? ADMIN_MENU_ITEMS : []),
  ];

  return (
    <CustomDrawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: theme.zIndex.appBar - 1,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: open ? "flex-end" : "center",
            alignItems: "center",
            p: 2,
            minHeight: 64,
          }}
        >
          <IconButton
            onClick={() => setOpen((prev) => !prev)}
            size="medium"
            sx={{
              color: "inherit",
              background: alpha(theme.palette.background.paper, 0.08),
              borderRadius: 2,
              transition: "background 0.2s",
              "&:hover": {
                background: alpha(theme.palette.background.paper, 0.18),
              },
            }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Divider
          sx={{
            borderColor: alpha(theme.palette.common.white, 0.12),
            mx: open ? 2 : 1,
            borderBottomWidth: 2,
          }}
        />
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <Tooltip
                key={item.path}
                title={!open ? item.text : ""}
                placement="right"
                arrow
              >
                <Box sx={{ position: "relative" }}>
                  <ListItemButton
                    selected={selected}
                    onClick={() => onMenuItemClick(item.path)}
                    sx={{
                      justifyContent: open ? "flex-start" : "center",
                      px: 2,
                      borderRadius: 2,
                      my: 0.5,
                      minHeight: 48,
                      boxShadow: selected
                        ? `0 2px 8px ${alpha(
                            theme.palette.secondary.main,
                            0.14
                          )}`
                        : undefined,
                      background: selected
                        ? alpha(theme.palette.secondary.main, 0.18)
                        : "transparent",
                      transition: "all 0.2s",
                      "&:hover": {
                        background: alpha(theme.palette.secondary.main, 0.12),
                        transform: "translateY(-2px) scale(1.03)",
                        boxShadow: `0 4px 16px ${alpha(
                          theme.palette.secondary.main,
                          0.10
                        )}`,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                        color: selected
                          ? theme.palette.secondary.main
                          : "inherit",
                        transition: "color 0.2s",
                        fontSize: 28,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: selected ? 700 : 500,
                          fontSize: 16,
                        }}
                      />
                    )}
                  </ListItemButton>
                  {selected && open && <ActiveIndicator />}
                </Box>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2, mt: "auto" }}>
        {user ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                justifyContent: open ? "flex-start" : "center",
                mb: open ? 2 : 0,
                transition: "all 0.2s",
              }}
            >
              <IconButton
                onClick={() => navigate("/profile")}
                sx={{
                  p: 0,
                  border: `2px solid ${alpha(
                    theme.palette.secondary.main,
                    0.4
                  )}`,
                  borderRadius: "50%",
                  boxShadow: `0 2px 8px ${alpha(
                    theme.palette.secondary.main,
                    0.12
                  )}`,
                  "&:hover": {
                    borderColor: theme.palette.secondary.main,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    width: 40,
                    height: 40,
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {user.userName?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              {open && (
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, lineHeight: 1.1 }}
                    noWrap
                  >
                    {user.userName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.7, fontSize: 12 }}
                  >
                    {isAdmin ? "Администратор" : "Пользователь"}
                  </Typography>
                </Box>
              )}
            </Box>
            {open && (
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<Logout />}
                onClick={() => {
                  navigate("/");
                  setTimeout(() => logout(), 200);
                }}
                sx={{
                  mt: 1,
                  color: "inherit",
                  borderColor: alpha(theme.palette.secondary.main, 0.5),
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: alpha(
                      theme.palette.secondary.main,
                      0.08
                    ),
                    borderColor: theme.palette.secondary.main,
                  },
                }}
              >
                Выйти
              </Button>
            )}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: open ? "flex-start" : "center",
            }}
          >
            {open ? (
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<AccountCircle />}
                onClick={() => navigate("/login")}
                sx={{
                  color: "inherit",
                  borderColor: alpha(theme.palette.secondary.main, 0.5),
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: alpha(
                      theme.palette.secondary.main,
                      0.08
                    ),
                    borderColor: theme.palette.secondary.main,
                  },
                }}
              >
                Войти
              </Button>
            ) : (
              <IconButton
                onClick={() => navigate("/login")}
                sx={{
                  color: "inherit",
                  border: `2px solid ${alpha(
                    theme.palette.secondary.main,
                    0.4
                  )}`,
                  borderRadius: "50%",
                  "&:hover": {
                    borderColor: theme.palette.secondary.main,
                  },
                }}
              >
                <AccountCircle />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </CustomDrawer>
  );
};

export default SideMenu;
