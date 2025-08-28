import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import { 
  Lock as LockIcon, 
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { 
  getUserRole, 
  isAdmin, 
  getUser, 
  isUserLoading
} from "../../redux/features/Auth/AuthSlice";

const RoleGuard = ({ children, requiredRole = "admin", fallback = null }) => {
  const userRole = useSelector(getUserRole);
  const isUserAdmin = useSelector(isAdmin);
  const user = useSelector(getUser);
  const loading = useSelector(isUserLoading);
  const navigate = useNavigate();

  // Show loading spinner while user data is being fetched
  if (loading || !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if user has required role
  const hasRequiredRole = () => {
    if (requiredRole === "admin") {
      return isUserAdmin;
    }
    return userRole === requiredRole;
  };

  // Debug logging (remove in production)
  console.log("RoleGuard Debug:", {
    user,
    userRole,
    isUserAdmin,
    requiredRole,
    hasRequiredRole: hasRequiredRole(),
    loading
  });

  // If user doesn't have required role, show fallback or access denied
  if (!hasRequiredRole()) {
    if (fallback) {
      return fallback;
    }

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          p: 3,
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: 400,
            width: "100%",
          }}
        >
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#ffebee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LockIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
            </Box>
          </Box>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            Access Denied
          </Typography>

          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            You don't have permission to access this feature. This area is restricted to {requiredRole} users only.
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Current role: <strong>{userRole || 'Not assigned'}</strong>
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/my-cards")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Go to My Cards
          </Button>
        </Paper>
      </Box>
    );
  }

  // If user has required role, render children
  return children;
};

export default RoleGuard;