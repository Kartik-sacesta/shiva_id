import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";

// Components
import AuthGuard from "../pages/AuthGuard/AuthGuard";
import Layout from "../layout/Layout";
import LoginModal from "../pages/login/LoginModal";
import CreateCard from "../pages/CreateCard/CreateCard";
import MyCards from "../pages/MyCards/MyCards";

const WithAuthGuard = ({ children }) => <AuthGuard>{children}</AuthGuard>;

// Loading component for Suspense
const LoadingFallback = () => (
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

const Router = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="auth-login" element={<LoginModal />} />

      {/* Protected Routes - Redirect to Create Card */}
      <Route
        path="/"
        element={
          <WithAuthGuard>
            <Layout title="Create Card">
              <Suspense fallback={<LoadingFallback />}>
                <CreateCard />
              </Suspense>
            </Layout>
          </WithAuthGuard>
        }
      />
      <Route
        path="/create-card"
        element={
          <WithAuthGuard>
            <Layout title="Create Card">
              <Suspense fallback={<LoadingFallback />}>
                <CreateCard />
              </Suspense>
            </Layout>
          </WithAuthGuard>
        }
      />
      <Route
        path="/my-cards"
        element={
          <WithAuthGuard>
            <Layout title="My Cards">
              <Suspense fallback={<LoadingFallback />}>
                <MyCards />
              </Suspense>
            </Layout>
          </WithAuthGuard>
        }
      />
      <Route
        path="/edit-card/:id"
        element={
          <WithAuthGuard>
            <Layout title="Edit Card">
              <Suspense fallback={<LoadingFallback />}>
                <CreateCard />
              </Suspense>
            </Layout>
          </WithAuthGuard>
        }
      />
    </Routes>
  );
};
export default Router;
