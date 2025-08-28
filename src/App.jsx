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
import "react-quill/dist/quill.snow.css";

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

  useEffect(() => {
    // Handle token validation results
    if (tokenError && !tokenLoading) {
      console.log("Token validation failed, clearing auth");
      dispatch(clearAuth());
      navigate("/auth-login");
      return;
    }

    if (tokenIsValid && !tokenLoading) {
      console.log("Token is valid, setting logged in");
      dispatch(setLoggedIn(true));
    }
  }, [tokenIsValid, tokenLoading, tokenError, dispatch, navigate]);

  useEffect(() => {
    // Handle user data fetching results
    if (userError && shouldFetchUser) {
      console.log("Failed to fetch user data, clearing auth");
      dispatch(clearAuth());
      navigate("/auth-login");
      return;
    }

    // Mark auth as checked when we have both token validation and user data (or failed to get them)
    if (!tokenLoading && (!shouldFetchUser || !userLoading)) {
      dispatch(setAuthChecked(true));
    }
  }, [userError, userLoading, shouldFetchUser, tokenLoading, dispatch, navigate]);

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
