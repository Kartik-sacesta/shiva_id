import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { getLoggedIn, isUserLoading } from "../../redux/features/Auth/AuthSlice";

const AuthGuard = ({ children }) => {
  const isLoggedIn = useSelector(getLoggedIn);
  const loading = useSelector(isUserLoading);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      // Store the attempted location for redirect after login
      navigate("/auth-login", { 
        state: { from: location },
        replace: true 
      });
    }
  }, [isLoggedIn, loading, navigate, location]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f6fa",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // If not logged in, don't render children (will redirect)
  if (!isLoggedIn) {
    return null;
  }

  // If logged in, render the protected content
  return children;
};

export default AuthGuard;
