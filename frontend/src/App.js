import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/UserManagementPage';
import ZoneListPage from './pages/ZoneListPage';
import ZoneDetailPage from './pages/ZoneDetailPage';
import ZoneFormPage from './pages/ZoneFormPage';
import RentalRequestFormPage from './pages/RentalRequestFormPage';
import RentalRequestListPage from './pages/RentalRequestListPage';
import RentalRequestDetailPage from './pages/RentalRequestDetailPage';
import ContractListPage from './pages/ContractListPage';
import ContractDetailPage from './pages/ContractDetailPage';

// Import CSS (no more MUI theme provider)
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute requireAdmin={true}>
                  <UserManagementPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/zones"
              element={
                <PrivateRoute>
                  <ZoneListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/zones/create"
              element={
                <PrivateRoute requireAdmin={true}>
                  <ZoneFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/zones/:id"
              element={
                <PrivateRoute>
                  <ZoneDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/zones/:id/edit"
              element={
                <PrivateRoute requireAdmin={true}>
                  <ZoneFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/zones/:zoneId/request"
              element={
                <PrivateRoute>
                  <RentalRequestFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/rentals"
              element={
                <PrivateRoute>
                  <RentalRequestListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/rentals/:id"
              element={
                <PrivateRoute>
                  <RentalRequestDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/contracts"
              element={
                <PrivateRoute>
                  <ContractListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/contracts/:id"
              element={
                <PrivateRoute>
                  <ContractDetailPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
