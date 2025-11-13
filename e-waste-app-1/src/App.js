
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EWasteLandingPage from './pages/Landing';
import RecyclingBackground from "./components/RecyclingBackground";
import EWasteChatbot from './components/EWasteChatbot';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PickupDashboard from './pages/PickupDashboard';
import EwasteRequestForm from './pages/EwasteRequestForm';
import MyRequests from './pages/MyRequests';
import EditProfile from './pages/EditProfile';
import AddPickupPerson from './pages/AddPickupPerson';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      {/* Main Routes */}
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<EWasteLandingPage />} />
        <Route path="/home" element={<EWasteLandingPage />} />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User routes */}
        <Route path="/user" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/user/submit-request" element={
          <ProtectedRoute requiredRole="user">
            <EwasteRequestForm />
          </ProtectedRoute>
        } />
        <Route path="/user/my-requests" element={
          <ProtectedRoute requiredRole="user">
            <MyRequests />
          </ProtectedRoute>
        } />
        <Route path="/user/edit-profile" element={
          <ProtectedRoute requiredRole="user">
            <EditProfile />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-pickup-person" element={
          <ProtectedRoute requiredRole="admin">
            <AddPickupPerson />
          </ProtectedRoute>
        } />
        
        {/* Pickup Person routes */}
        <Route path="/pickup" element={
          <ProtectedRoute requiredRole="pickup">
            <PickupDashboard />
          </ProtectedRoute>
        } />
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Chatbot - Available on all pages */}
      <EWasteChatbot />
      <RecyclingBackground />
    </div>
  );
}

export default App;

