import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import Router from "./app/route/route";
import { useValidateTokenQuery, useGetCurrentUserQuery } from "./app/services/api/AuthApi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { 
  setLoggedIn, 
  clearAuth, 
  setAuthChecked,
  isAuthReady
} from "./app/redux/features/Auth/AuthSlice";
import { CircularProgress, Box } from "@mui/material";
import { StepNavigationProvider } from "./app/contexts/StepNavigationContext.jsx";


function App() {
  const { 
    isSuccess: tokenIsValid, 
    isLoading: tokenLoading, 
    isError: tokenError 
  } = useValidateTokenQuery();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authReady = useSelector(isAuthReady);

  // Skip user query if token validation failed or is still loading
  const shouldFetchUser = tokenIsValid && !tokenLoading && !tokenError;
  
  const {
    isLoading: userLoading,
    isError: userError
  } = useGetCurrentUserQuery(undefined, {
    skip: !shouldFetchUser
  });

 // In App.js - Replace the useEffect blocks with these:
useEffect(() => {
  // Only run token validation if there's a token in localStorage
  const token = localStorage.getItem("accessToken");
  
  if (!token && !tokenLoading) {
    // No token found, mark auth as checked and don't validate
    dispatch(setAuthChecked(true));
    return;
  }

  // Handle token validation results only if we attempted validation
  if (tokenError && !tokenLoading) {
    console.log("Token validation failed, clearing auth");
    dispatch(clearAuth());
    return;
  }

  if (tokenIsValid && !tokenLoading) {
    console.log("Token is valid, setting logged in");
    dispatch(setLoggedIn(true));
  }
}, [tokenIsValid, tokenLoading, tokenError, dispatch]);

useEffect(() => {
  // Handle user data fetching results
  if (userError && shouldFetchUser) {
    console.log("Failed to fetch user data, clearing auth");
    dispatch(clearAuth());
    return;
  }

  // Mark auth as checked when we have completed all necessary checks
  if (!tokenLoading && (!shouldFetchUser || !userLoading)) {
    dispatch(setAuthChecked(true));
  }
}, [userError, userLoading, shouldFetchUser, tokenLoading, dispatch]);



  // Show loading screen while checking authentication
  if (tokenLoading || (shouldFetchUser && userLoading) || !authReady) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f6fa",
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <div style={{ fontSize: '14px', color: '#666' }}>
          {tokenLoading && "Validating session..."}
          {shouldFetchUser && userLoading && "Loading user data..."}
          {!tokenLoading && !userLoading && !authReady && "Initializing..."}
        </div>
      </Box>
    );
  }

  return (
    <StepNavigationProvider>
      <Router />
    </StepNavigationProvider>
  );
}

export default App;
