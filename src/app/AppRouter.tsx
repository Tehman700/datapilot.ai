import { Routes, Route, Navigate, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { useAuth } from './context/AuthContext';
import LoginPage  from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage  from './pages/AdminPage';
import App from './App';

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isAdmin)   return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function Public({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <>{children}</>;
  return <Navigate to={user?.isAdmin ? '/admin' : '/dashboard'} replace />;
}

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login"     element={<Public><LoginPage /></Public>} />
        <Route path="/signup"    element={<Public><SignupPage /></Public>} />
        <Route path="/dashboard" element={<Protected><App /></Protected>} />
        <Route path="/admin"     element={<AdminOnly><AdminPage /></AdminOnly>} />
        <Route path="*"          element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
