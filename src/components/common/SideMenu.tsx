// import React from "react"
// import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
// // Импорт компонентов Material UI для создания бокового меню.
// import { Home, Settings, Info, Mail, Balance } from "@mui/icons-material"
// // Импорт иконок из Material UI для отображения в меню.
// import { useLocation } from "react-router-dom"

// interface SideMenuProps {
//   onMenuItemClick: (path: string) => void
//   // Пропс отвечает за обработку кликов по элементам меню.
// }

// const MENU_ITEMS = [
//   // Массив с настройками пунктов меню: текст, иконка и путь.
//   { text: "Домашняя", icon: <Home />, path: "/" },
//   { text: "Все объекты", icon: <Info />, path: "/objects-for-users" },
//   { text: "Панель администратора", icon: <Settings />, path: "/objects" },
// ]

// const SideMenu: React.FC<SideMenuProps> = ({ onMenuItemClick }) => {
//   const location = useLocation()
//   // Хук для получения текущего пути. Используется для подсветки активного элемента меню.

//   return (
//     <Drawer
//       variant="permanent"
//       // Тип `permanent` означает, что меню всегда отображается (не скрывается).
//       sx={{
//         width: 240,
//         // Устанавливаем фиксированную ширину для бокового меню.
//         flexShrink: 0,
//         // Предотвращаем сужение бокового меню при изменении размера окна.
//         "& .MuiDrawer-paper": {
//           // Настройка внешнего вида панели внутри Drawer.
//           width: 240,
//           boxSizing: "border-box",
//           marginTop: "64px", // Смещение вниз, чтобы меню отображалось под хедером.
//           height: "calc(100vh - 64px)", // Устанавливаем высоту меню на весь экран минус высота хедера.
//           borderRight: "none", // Убираем правую границу меню.
//           backgroundColor: "#f5f5f5", // Легкий фон для панели меню.
//         },
//       }}
//     >
//       <List>

//         {MENU_ITEMS.map((item) => (
//           <ListItemButton
//             key={item.text}
//             // `key` обязателен для корректного отображения списка React.
//             onClick={() => onMenuItemClick(item.path)}
//             // При клике вызываем функцию с соответствующим путём.
//             sx={{
//               backgroundColor:
//                 location.pathname === item.path ? "rgba(65, 12, 222, 0.5)" : "inherit",
//               // Подсвечиваем активный элемент меню, если текущий путь совпадает с его путём.
//               "&:hover": {
//                 backgroundColor: "#b042f5",
//                 // Меняем цвет фона элемента меню при наведении.
//               },
//             }}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>

//             <ListItemText primary={item.text} />

//           </ListItemButton>
//         ))}
//       </List>
//     </Drawer>
//   )
// }

// export default SideMenu
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
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SideMenuProps {
  onMenuItemClick: (path: string) => void;
}

const MENU_ITEMS = [
  { text: "Главная", icon: <Home />, path: "/" },
  { text: "Все объекты", icon: <Info />, path: "/objects-for-users" },
  { text: "Панель администратора", icon: <Settings />, path: "/objects" },
];

const SideMenu: React.FC<SideMenuProps> = ({ onMenuItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const drawerWidth = open ? 240 : 72;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: theme.zIndex.appBar - 1, // Важно: должен быть под AppBar
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          boxSizing: 'border-box',
          mt: '64px', // Высота AppBar
          height: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
      }}
    >
      {/* Верхняя часть с кнопкой и пунктами меню */}
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
          {MENU_ITEMS.map((item) => (
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

      {/* Нижняя часть — профиль пользователя */}
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
