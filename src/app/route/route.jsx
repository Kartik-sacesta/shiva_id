import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";

// Components
import AuthGuard from "../pages/AuthGuard/AuthGuard";
import RoleGuard from "../pages/AuthGuard/RoleGuard";
import Layout from "../layout/Layout";
import LoginModal from "../pages/login/LoginModal";
import CreateCard from "../pages/CreateCard/CreateCard";
import MyCards from "../pages/MyCards/MyCards";
import Dashboard from "../pages/Dashboard/Dashboard";

const WithAuthGuard = ({ children }) => <AuthGuard>{children}</AuthGuard>;
const WithAdminGuard = ({ children }) => (
  <AuthGuard>
    <RoleGuard requiredRole="admin">{children}</RoleGuard>
  </AuthGuard>
);

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

      {/* Dashboard Route - Redirects based on role */}
      <Route
        path="/"
        element={
          <WithAuthGuard>
            <Layout title="Dashboard">
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            </Layout>
          </WithAuthGuard>
        }
      />
      <Route
        path="/create-card"
        element={
          <WithAdminGuard>
            <Layout title="Create Card">
              <Suspense fallback={<LoadingFallback />}>
                <CreateCard />
              </Suspense>
            </Layout>
          </WithAdminGuard>
        }
      />
      
      {/* Protected Routes - All Authenticated Users */}
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
      
      {/* Admin Only - Edit Card */}
      <Route
        path="/edit-card/:id"
        element={
          <WithAdminGuard>
            <Layout title="Edit Card">
              <Suspense fallback={<LoadingFallback />}>
                <CreateCard />
              </Suspense>
            </Layout>
          </WithAdminGuard>
        }
      />
    </Routes>
  );
};
export default Router;
