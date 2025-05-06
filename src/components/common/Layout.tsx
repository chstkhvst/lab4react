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
          maxWidth: '90%'
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
