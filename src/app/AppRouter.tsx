import { Routes, Route, Navigate, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { useAuth } from './context/AuthContext';
import LoginPage  from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import App from './App';

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function Public({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login"     element={<Public><LoginPage /></Public>} />
        <Route path="/signup"    element={<Public><SignupPage /></Public>} />
        <Route path="/dashboard" element={<Protected><App /></Protected>} />
        <Route path="*"          element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
