import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { isAdmin } from "../../redux/features/Auth/AuthSlice";
import CreateCard from "../CreateCard/CreateCard";

const Dashboard = () => {
  const userIsAdmin = useSelector(isAdmin);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not admin, redirect to My Cards
    if (!userIsAdmin) {
      navigate("/my-cards", { replace: true });
    }
  }, [userIsAdmin, navigate]);

  // Show loading while redirecting non-admin users
  if (!userIsAdmin) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If admin, show CreateCard component
  return <CreateCard />;
};

export default Dashboard;
