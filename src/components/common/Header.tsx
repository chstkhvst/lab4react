import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Business } from "@mui/icons-material";

const Header: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      color="primary"
      elevation={2}
      sx={{
        height: 64,
        paddingLeft: 20,
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Business />
          <Typography variant="h6" noWrap>
            Агентство недвижимости
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
