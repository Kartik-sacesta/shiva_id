import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getLoggedIn } from "../../redux/features/Auth/AuthSlice";
import {
  useLoginMutation,
  useValidateTokenQuery,
} from "../../services/api/AuthApi";

const LoginModal = () => {
  // const { isSuccess: tokenSuccess, isLoading: tokenLoading } =
  //   useValidateTokenQuery();

  const { isSuccess: tokenSuccess, isLoading: tokenLoading } =
    useValidateTokenQuery();

  const isLoggedIn = useSelector(getLoggedIn);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorVal, setError] = useState("");
  const [login, { isError, isSuccess, isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

 // In LoginModal.js - Replace the useEffect blocks with these:
useEffect(() => {
  // Only redirect if fully logged in and not in loading state
  if (isLoggedIn && !tokenLoading && !isLoading) {
    navigate("/");
  }
}, [isLoggedIn, tokenLoading, isLoading, navigate]);

useEffect(() => {
  if (isSuccess && !isLoading) {
    // Small delay to ensure token is properly stored
    setTimeout(() => {
      navigate("/");
    }, 100);
  }

  if (isError && !isLoading) {
    console.error(error);
    if (error?.status === "FETCH_ERROR") setError("Server Down");
    else setError(error?.data?.message || "Login failed");
  }
}, [isSuccess, isLoading, isError, error, navigate]);
  const onFormSubmit = async (formData) => {
    const payload = {
      email: formData.email,
      password: formData.passcode,
    };

    try {
      await login(payload);
    } catch (err) {
      console.error(err);
      setError("Cannot login with credentials");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f6fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <img src="/images/logo512.png" alt="logo" width={40} />
          <Typography variant="h6" fontWeight={600}>
            ShivID
          </Typography>
        </Box>

        {/* Title */}
        <Typography component="h1" variant="h5" align="center" fontWeight={600}>
          Sign-In
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" mb={2}>
          Access ShivID dashboard
        </Typography>

        {/* Error */}
        {errorVal && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorVal}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            {...register("email", {
              required: "Email is required",
              maxLength: {
                value: 50,
                message: "The email should have at most 50 characters",
              },
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Email address must be a valid address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{ sx: { backgroundColor: "#f5f7ff" } }}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={showPassword ? "text" : "password"}
            {...register("passcode", {
              required: "This field is required",
            })}
            error={!!errors.passcode}
            helperText={errors.passcode?.message}
            InputProps={{
              sx: { backgroundColor: "#f5f7ff" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Forgot password */}
          <Box textAlign="right" mt={1}>
            <Link
              to={`${import.meta.env.PUBLIC_URL}/auth-reset`}
              style={{
                fontSize: "0.85rem",
                textDecoration: "none",
                color: "#6366f1",
              }}
            >
              Forgot password?
            </Link>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "#6366f1",
              textTransform: "none",
              fontWeight: 600,
              ":hover": { bgcolor: "#4f46e5" },
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign in"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginModal;
