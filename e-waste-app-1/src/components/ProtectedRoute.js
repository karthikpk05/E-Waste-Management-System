
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { user, token, loading } = useAuth();

//   if (loading) {
//     // Show a loading spinner or message while auth is being checked
//     return <div>Loading...</div>;
//   }

//   if (!token || !user) {
//     // If not logged in, redirect to login page
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRole && user.role !== requiredRole) {
//     // If role doesn't match, redirect to appropriate dashboard
//     return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
//   }

//   // If logged in and role matches, render the protected component
//   return children;
// };

// export default ProtectedRoute;
// Updated ProtectedRoute component to handle three roles: user, admin, and pickup person
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    // Show a loading spinner or message while auth is being checked
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If role doesn't match, redirect to appropriate dashboard based on user's actual role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'pickup':
        return <Navigate to="/pickup" replace />;
      case 'user':
      default:
        return <Navigate to="/user" replace />;
    }
  }

  // If logged in and role matches (or no specific role required), render the protected component
  return children;
};

export default ProtectedRoute;