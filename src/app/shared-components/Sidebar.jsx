import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  CreditCard as CreditCardIcon,
  Add as AddIcon,
  ContactMail as ContactMailIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "../redux/features/Auth/AuthSlice";
import { getUser, isAdmin } from "../redux/features/Auth/AuthSlice";

const DRAWER_WIDTH = 280;

// Base menu items available to all users
const baseMenuItems = [
  {
    text: "My Cards",
    icon: <CreditCardIcon />,
    path: "/my-cards",
  },
];

// Admin-only menu items
const adminMenuItems = [
  {
    text: "Create Card",
    icon: <AddIcon />,
    path: "/",
  },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const userIsAdmin = useSelector(isAdmin);


console.log("user is admin---->", userIsAdmin); // 👈 Fixed console.log
  // Get menu items based on user role
  const getMenuItems = () => {
    let menuItems = [...baseMenuItems];
    if (userIsAdmin) {
      menuItems = [...adminMenuItems, ...baseMenuItems];
    }
    return menuItems;
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(clearAuth()); // Clear all auth state
    window.location.href = "/auth-login";
  };

  const drawer = (
    <Box
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      className="custom-scrollbar"
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#1976d2",
          color: "white",
          minHeight: 64,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="/images/logo512.png"
            alt="ShivID Logo"
            style={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32 }}
          />
          <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={600}>
            ShivID
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

     
      

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 1, px: { xs: 0.5, sm: 1 } }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: { xs: 0.5, sm: 1 },
                borderRadius: 1,
                py: { xs: 1, sm: 1.5 },
                "&.Mui-selected": {
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  "& .MuiListItemIcon-root": {
                    color: "#1976d2",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 36, sm: 40 } }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  variant: isMobile ? "body2" : "body1",
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Logout Button */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: 1,
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "#ffebee",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "#d32f2f" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
