import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MobileShell } from '@/components/layout/MobileShell';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PlantsPage = lazy(() => import('@/pages/PlantsPage'));
const PlantDetailPage = lazy(() => import('@/pages/PlantDetailPage'));
const AddPlantPage = lazy(() => import('@/pages/AddPlantPage'));
const EditPlantPage = lazy(() => import('@/pages/EditPlantPage'));
const CareLogPage = lazy(() => import('@/pages/CareLogPage'));
const GrowthPage = lazy(() => import('@/pages/GrowthPage'));
const HealthPage = lazy(() => import('@/pages/HealthPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner size="lg" />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner size="lg" />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <Routes>
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

        <Route element={<ProtectedRoute><MobileShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/plants" element={<PlantsPage />} />
          <Route path="/plants/new" element={<AddPlantPage />} />
          <Route path="/plants/:id" element={<PlantDetailPage />} />
          <Route path="/plants/:id/edit" element={<EditPlantPage />} />
          <Route path="/plants/:id/care" element={<CareLogPage />} />
          <Route path="/plants/:id/growth" element={<GrowthPage />} />
          <Route path="/plants/:id/health" element={<HealthPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
