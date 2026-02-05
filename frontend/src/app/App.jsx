import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  UserProvider,
  useUser,
} from "@/app/contexts/UserContext.jsx";
import { SettingsProvider } from "@/app/contexts/SettingsContext.jsx";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { Toaster } from "@/app/components/ui/sonner";

// Pages
import { WelcomePage } from "@/app/components/WelcomePage";
import { RegisterPage } from "@/app/components/RegisterPage.jsx";
import { LoginPage } from "@/app/components/LoginPage";
import { ForgotPassword } from "@/app/components/ForgotPassword";
import { ResetPassword } from "@/app/components/ResetPassword";
import { Layout } from "@/app/components/Layout";
import { Dashboard } from "@/app/components/Dashboard";
import { CoursesPage } from "@/app/components/CoursesPage";
import { CourseDetailsPage } from "@/app/components/CourseDetailsPage.jsx";
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
import { FinancePage } from "@/app/components/FinancePage.jsx";
import { StudentIndicationsPage } from "@/app/components/StudentIndicationsPage.jsx";
import { DonationsPage } from "@/app/components/DonationsPage.jsx";
import { CandidatesPage } from "@/app/components/CandidatesPage";
import { AdminPage } from "@/app/components/AdminPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function RoleProtectedRoute({ children, path }) {
  const { canAccessRoute, getHomeRoute } = useUser();

  // Verificar se o usuário tem permissão para acessar a rota específica
  if (!canAccessRoute(path)) {
    // Redirecionar para a página inicial do usuário baseada no seu role
    return <Navigate to={getHomeRoute()} replace />;
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
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<RoleProtectedRoute path="/dashboard"><Dashboard /></RoleProtectedRoute>} />
          <Route path="cursos" element={<RoleProtectedRoute path="/cursos"><CoursesPage /></RoleProtectedRoute>} />
          <Route path="cursos/:courseId" element={<RoleProtectedRoute path="/cursos"><CourseDetailsPage /></RoleProtectedRoute>} />
          <Route path="vagas" element={<RoleProtectedRoute path="/vagas"><JobsPage /></RoleProtectedRoute>} />
          <Route path="candidatos" element={<RoleProtectedRoute path="/candidatos"><CandidatesPage /></RoleProtectedRoute>} />
          <Route path="alertas" element={<RoleProtectedRoute path="/alertas"><AlertsPage /></RoleProtectedRoute>} />
          <Route
            path="linha-do-tempo"
            element={<RoleProtectedRoute path="/linha-do-tempo"><TimelinePage /></RoleProtectedRoute>}
          />
          <Route path="empresas" element={<RoleProtectedRoute path="/empresas"><CompaniesPage /></RoleProtectedRoute>} />
          <Route path="perfil" element={<RoleProtectedRoute path="/perfil"><ProfilePage /></RoleProtectedRoute>} />
          <Route path="metricas" element={<RoleProtectedRoute path="/metricas"><MetricsPage /></RoleProtectedRoute>} />
          <Route
            path="gamificacao"
            element={<RoleProtectedRoute path="/gamificacao"><GamificationPage /></RoleProtectedRoute>}
          />
          <Route path="admin" element={<RoleProtectedRoute path="/admin"><AdminPage /></RoleProtectedRoute>} />
          <Route path="mentoria" element={<RoleProtectedRoute path="/mentoria"><MentorshipPage /></RoleProtectedRoute>} />
          <Route path="suporte" element={<RoleProtectedRoute path="/suporte"><SupportPage /></RoleProtectedRoute>} />
          <Route path="financeiro" element={<RoleProtectedRoute path="/financeiro"><FinancePage /></RoleProtectedRoute>} />
          <Route path="indicacoes" element={<RoleProtectedRoute path="/indicacoes"><StudentIndicationsPage /></RoleProtectedRoute>} />
          <Route path="doacoes" element={<RoleProtectedRoute path="/doacoes"><DonationsPage /></RoleProtectedRoute>} />
          <Route path="configuracoes" element={<RoleProtectedRoute path="/configuracoes"><SettingsPage /></RoleProtectedRoute>} />
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