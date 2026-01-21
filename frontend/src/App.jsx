import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './application/context/AuthContext';
import ProtectedRoute from './ui/components/ProtectedRoute';
import PublicRoute from './ui/components/PublicRoute';
import Login from './ui/pages/Login';
import Signup from './ui/pages/Signup';
import Dashboard from './ui/pages/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-slate-950 min-h-screen">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
