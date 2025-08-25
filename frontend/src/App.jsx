import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UnauthorizedPage from "./pages/UnauthorizedPage";

// Context
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/auth/ProfilePage";

// Dashboards
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import FacultyDashboard from "./pages/dashboard/FacultyDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// Rooms
import RoomList from "./pages/rooms/RoomList";
import RoomDetails from "./pages/rooms/RoomDetails";
import RoomAvailability from "./pages/rooms/RoomAvailability";
import ManageRoomsPage from "./pages/rooms/ManageRooms";

// Bookings
import MyBookings from "./pages/bookings/MyBookings";
import ManageBookings from "./pages/bookings/ManageBookings";

// Maintenance
import MyRequests from "./pages/maintenance/MyRequests";
import ManageRequests from "./pages/maintenance/ManageRequests";

// Alerts
import AlertsPage from "./pages/alerts/AlertsPage";
import CreateAlert from "./pages/alerts/CreateAlert";

// Analytics
import AnalyticsPage from "./pages/analytics/AnalyticsPage";

// Timetable
import UploadTimetablePage from "./pages/timetable/UploadTimetable";

// Calendar
import CalendarViewPage from "./pages/calendar/CalendarView";

// Users
import UserManagementPage from "./pages/users/UserManagement";

import "./App.css";

// Loading component for initial auth check
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Component to handle dashboard redirection based on role
  function DashboardRedirect() {
    const { user, loading } = useAuth();
    
    // Show loading while auth state is being determined
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    // If no user is authenticated (shouldn't happen due to ProtectedRoute, but safe guard)
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    // Redirect based on role
    if (user.role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (user.role === 'faculty') {
      return <Navigate to="/dashboard/faculty" replace />;
    } else {
      return <Navigate to="/dashboard/student" replace />;
    }
  }

  // Pages that should NOT show navbar/sidebar
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  // Show loading spinner while auth state is being determined
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen">
      {/* Only show sidebar/navbar if not on login/register and user is authenticated */}
      {!hideLayout && user && (
        <>
          <Sidebar />
        </>
      )}

      <div className="flex-1 flex flex-col">
        {!hideLayout && user && <Navbar />}

        <main className="p-4 flex-1 overflow-y-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/student" element={
              <ProtectedRoute roles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/faculty" element={
              <ProtectedRoute roles={["faculty"]}>
                <FacultyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Room Management Routes */}
            <Route path="/rooms" element={
              <ProtectedRoute>
                <RoomList />
              </ProtectedRoute>
            } />
            <Route path="/rooms/:id" element={
              <ProtectedRoute>
                <RoomDetails />
              </ProtectedRoute>
            } />
            <Route path="/rooms/:id/availability" element={
              <ProtectedRoute>
                <RoomAvailability />
              </ProtectedRoute>
            } />
            <Route path="/rooms/manage" element={
              <ProtectedRoute roles={["admin"]}>
                <ManageRoomsPage />
              </ProtectedRoute>
            } />

            {/* Booking Routes */}
            <Route path="/bookings/my" element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/bookings/manage" element={
              <ProtectedRoute roles={["admin"]}>
                <ManageBookings />
              </ProtectedRoute>
            } />

            {/* Maintenance Routes */}
            <Route path="/maintenance/my" element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            } />
            <Route path="/maintenance/manage" element={
              <ProtectedRoute roles={["admin"]}>
                <ManageRequests />
              </ProtectedRoute>
            } />

            {/* Alert Routes */}
            <Route path="/alerts" element={
              <ProtectedRoute>
                <AlertsPage />
              </ProtectedRoute>
            } />
            <Route path="/alerts/create" element={
              <ProtectedRoute roles={["admin"]}>
                <CreateAlert />
              </ProtectedRoute>
            } />

            {/* Analytics Routes */}
            <Route path="/analytics" element={
              <ProtectedRoute roles={["admin"]}>
                <AnalyticsPage />
              </ProtectedRoute>
            } />

            {/* Timetable Routes */}
            <Route path="/timetable/upload" element={
              <ProtectedRoute roles={["admin"]}>
                <UploadTimetablePage />
              </ProtectedRoute>
            } />

            {/* Calendar Routes */}
            <Route path="/calendar" element={
              <ProtectedRoute roles={["admin"]}>
                <CalendarViewPage />
              </ProtectedRoute>
            } />

            {/* User Management Routes */}
            <Route path="/users/manage" element={
              <ProtectedRoute roles={["admin"]}>
                <UserManagementPage />
              </ProtectedRoute>
            } />

            {/* Default and Catch-all Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;