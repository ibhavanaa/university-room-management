import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";

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
import AvailabilityChecker from "./pages/availability/AvailabilityChecker"; 
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
import ViewTimetable from "./pages/timetable/ViewTimetable";

// Calendar
import CalendarViewPage from "./pages/calendar/CalendarView";

// Users
import UserManagementPage from "./pages/users/UserManagement";

import "./App.css";

// Loading Spinner
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

  // Dashboard Redirector
  function DashboardRedirect() {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    if (!user) return <Navigate to="/login" replace />;

    if (user.role === "admin") return <Navigate to="/dashboard/admin" replace />;
    if (user.role === "faculty") return <Navigate to="/dashboard/faculty" replace />;
    return <Navigate to="/dashboard/student" replace />;
  }

  // No Navbar/Sidebar on login/register
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-screen">
      {!hideLayout && user && <Sidebar />}

      <div className="flex-1 flex flex-col">
        {!hideLayout && user && <Navbar />}

        <main className="p-4 flex-1 overflow-y-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Dashboards */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute roles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/faculty"
              element={
                <ProtectedRoute roles={["faculty"]}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Rooms */}
            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <RoomList isAdmin={false} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id"
              element={
                <ProtectedRoute>
                  <RoomDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id/availability"
              element={
                <ProtectedRoute>
                  <RoomAvailability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/availability"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AvailabilityChecker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/manage"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageRoomsPage />
                </ProtectedRoute>
              }
            />

            {/* Bookings */}
            <Route
              path="/bookings/my"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/manage"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageBookings />
                </ProtectedRoute>
              }
            />

            {/* Maintenance */}
            <Route
              path="/maintenance/my"
              element={
                <ProtectedRoute>
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance/manage"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ManageRequests />
                </ProtectedRoute>
              }
            />

            {/* Alerts */}
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <AlertsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts/create"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <CreateAlert />
                </ProtectedRoute>
              }
            />

            {/* Analytics with Downloads */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            {/* Timetable */}
            <Route
              path="/timetable/upload"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <UploadTimetablePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timetable/view"
              element={
                <ProtectedRoute>
                  <ViewTimetable />
                </ProtectedRoute>
              }
            />

            {/* Calendar */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <CalendarViewPage />
                </ProtectedRoute>
              }
            />

            {/* Users */}
            <Route
              path="/users/manage"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Default Redirects */}
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
