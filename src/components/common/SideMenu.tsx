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
  Description
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SideMenuProps {
  onMenuItemClick: (path: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ onMenuItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const drawerWidth = open ? 240 : 72;

  // Базовые пункты меню (без изменений)
  const BASE_MENU_ITEMS = [
    { text: "Главная", icon: <Info />, path: "/" },
    { text: "Все объекты", icon: <Home />, path: "/objects-for-users" },
  ];

const ADMIN_MENU_ITEMS = [
  { text: "Редактировать объекты", icon: <Settings />, path: "/objects" },
  { text: "Все пользователи", icon: <People />, path: "/all-users" },
  { text: "Бронирования", icon: <Bookmark />, path: "/reservations" },
  { text: "Договоры", icon: <Description />, path: "/contracts" } 
];

  // Формируем полный список пунктов меню
  const menuItems = [
    ...BASE_MENU_ITEMS,
    ...(isAdmin ? ADMIN_MENU_ITEMS : [])
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: theme.zIndex.appBar - 1,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          boxSizing: 'border-box',
          mt: '64px',
          height: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      }}
    >
      <Box>
        <Box sx={{ display: "flex", justifyContent: open ? "flex-end" : "center", p: 2 }}>
          <IconButton 
            onClick={() => setOpen((prev) => !prev)} 
            size="small"
            sx={{ color: 'inherit' }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
        <List>
          {menuItems.map((item) => (
            <Tooltip key={item.path} title={!open ? item.text : ""} placement="right" arrow>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => onMenuItemClick(item.path)}
                sx={{ 
                  justifyContent: open ? "flex-start" : "center",
                  px: 2,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0, 
                  mr: open ? 2 : 0,
                  color: 'inherit',
                }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        {user ? (
          <>
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1, 
                justifyContent: open ? "flex-start" : "center",
                mb: open ? 2 : 0,
              }}
            >
              <IconButton onClick={() => navigate("/profile")} sx={{ p: 0 }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.secondary.main, 
                  color: theme.palette.secondary.contrastText,
                  width: 36, 
                  height: 36,
                }}>
                  {user.userName?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              {open && (
                <Typography variant="body2" noWrap>
                  {user.userName}
                </Typography>
              )}
            </Box>
            
            {open && (
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<Logout />}
                onClick={logout}
                sx={{
                  mt: 1,
                  color: 'inherit',
                  borderColor: 'inherit',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Выйти
              </Button>
            )}
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: open ? "flex-start" : "center" }}>
            {open ? (
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<AccountCircle />}
                onClick={() => navigate("/login")}
                sx={{
                  color: 'inherit',
                  borderColor: 'inherit',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Войти
              </Button>
            ) : (
              <IconButton 
                onClick={() => navigate("/login")}
                sx={{ color: 'inherit' }}
              >
                <AccountCircle />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default SideMenu;