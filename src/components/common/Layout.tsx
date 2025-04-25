// import React from "react"
// import { Box, CssBaseline } from "@mui/material"
// // Импорт компонентов из Material UI: Box — контейнер для стилизации, CssBaseline — сброс стилей браузера.
// import Header from "./Header"
// import SideMenu from "./SideMenu"
// import { useNavigate } from "react-router-dom"

// interface LayoutProps {
//   children: React.ReactNode
// }
// // Определение интерфейса для пропсов компонента Layout.
// // Ожидается, что будет передан `children` (вложенные компоненты).

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   // Функциональный компонент Layout, который используется для отображения основной структуры приложения.

//   const navigate = useNavigate()
//   // Хук useNavigate из react-router-dom используется для программной навигации.

//   const handleMenuItemClick = (path: string) => {
//     navigate(path)
//     // Функция для обработки кликов по пунктам меню. Принимает путь маршрута и выполняет переход.
//   }

//   return (
//     <Box>

//       <CssBaseline />

//       <Header />

//       <SideMenu onMenuItemClick={handleMenuItemClick} />

//       <Box
//         component="main"
//         // Основная область страницы, где будет отображаться содержимое `children`.
//         sx={{
//           flexGrow: 1, // Основной контейнер занимает оставшееся пространство.
//           padding: 3, // Отступы внутри основного контейнера.
//           marginLeft: "240px", // Отступ слева (ширина бокового меню).
//         }}
//       >
//         {children}

//       </Box>
//     </Box>
//   )
// }
// export default Layout;
import React from "react";
import { Box, CssBaseline, Paper } from "@mui/material";
import Header from "./Header";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 60;
const headerHeight = 64;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Шапка */}
      <Header />

      {/* Мини-боковая панель */}
      <SideMenu onMenuItemClick={handleMenuClick} />

      {/* Основная область */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${headerHeight}px`,
          ml: `${drawerWidth}px`,
          p: 2,
        }}
      >
        <Paper elevation={1} sx={{ p: 2 }}>
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;
