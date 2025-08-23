import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Sidebar from "../shared-components/Sidebar";

const DRAWER_WIDTH = 280;

const Layout = ({ children, title = "ShivID Dashboard" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar - Only visible on mobile */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: "100%",
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: "#1976d2",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src="/images/logo512.png"
                alt="ShivID Logo"
                style={{ width: 24, height: 24 }}
              />
              <Typography variant="h6" noWrap component="div">
                {title}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: "#f5f6fa",
          minHeight: "100vh",
          pt: { xs: 8, md: 0 }, // Add top padding on mobile for AppBar
          overflow: "auto",
        }}
        className="custom-scrollbar"
      >
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 3, lg: 4 },
            mx: "auto",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
