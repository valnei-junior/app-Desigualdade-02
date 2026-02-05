import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  UserProvider,
  useUser,
} from "@/app/contexts/UserContext";
import { SettingsProvider } from "@/app/contexts/SettingsContext";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { Toaster } from "@/app/components/ui/sonner";

// Pages
import { WelcomePage } from "@/app/components/WelcomePage";
import { RegisterPage } from "@/app/components/RegisterPage";
import { LoginPage } from "@/app/components/LoginPage";
import { ForgotPassword } from "@/app/components/ForgotPassword";
import { Layout } from "@/app/components/Layout";
import { Dashboard } from "@/app/components/Dashboard";
import { CoursesPage } from "@/app/components/CoursesPage";
import { CourseDetailsPage } from "@/app/components/CourseDetailsPage";
import { JobsPage } from "@/app/components/JobsPage";
import { AlertsPage } from "@/app/components/AlertsPage";
import { TimelinePage } from "@/app/components/TimelinePage";
import { CompaniesPage } from "@/app/components/CompaniesPage";
import { ProfilePage } from "@/app/components/ProfilePage";
import { MetricsPage } from "@/app/components/MetricsPage";
import { GamificationPage } from "@/app/components/GamificationPage";
import { MentorshipPage } from "@/app/components/MentorshipPage";
import { SupportPage } from "@/app/components/SupportPage";
import { SettingsPage } from "@/app/components/SettingsPage";
import { FinancePage } from "@/app/components/FinancePage";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  // Ativar atalhos de teclado
  useKeyboardShortcuts();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cursos" element={<CoursesPage />} />
          <Route path="cursos/:courseId" element={<CourseDetailsPage />} />
          <Route path="vagas" element={<JobsPage />} />
          <Route path="alertas" element={<AlertsPage />} />
          <Route
            path="linha-do-tempo"
            element={<TimelinePage />}
          />
          <Route path="empresas" element={<CompaniesPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="metricas" element={<MetricsPage />} />
          <Route
            path="gamificacao"
            element={<GamificationPage />}
          />
          <Route path="mentoria" element={<MentorshipPage />} />
          <Route path="suporte" element={<SupportPage />} />
          <Route path="financeiro" element={<FinancePage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </SettingsProvider>
  );
}