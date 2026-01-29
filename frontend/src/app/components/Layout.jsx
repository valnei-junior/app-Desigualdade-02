import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useUser } from '@/app/contexts/UserContext.jsx';
import { ROLE_LABELS, canAccessRoute } from '@/app/constants/roles';
import {
  Home,
  BookOpen,
  Briefcase,
  Bell,
  TrendingUp,
  Building2,
  User,
  BarChart3,
  HelpCircle,
  Award,
  Users,
  LogOut,
  Menu,
  Settings
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/app/components/ui/sheet';
import { Separator } from '@/app/components/ui/separator';
import { AccessibilityToolbar } from '@/app/components/AccessibilityToolbar';
import { SkipToContent } from '@/app/components/SkipToContent';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Cursos', href: '/cursos', icon: BookOpen },
  { name: 'Vagas', href: '/vagas', icon: Briefcase },
  { name: 'Candidatos', href: '/candidatos', icon: Users },
  { name: 'Alertas', href: '/alertas', icon: Bell },
  { name: 'Linha do Tempo', href: '/linha-do-tempo', icon: TrendingUp },
  { name: 'Empresas', href: '/empresas', icon: Building2 },
  { name: 'Perfil', href: '/perfil', icon: User },
  { name: 'Métricas', href: '/metricas', icon: BarChart3 },
  { name: 'Gamificação', href: '/gamificacao', icon: Award },
  { name: 'Mentoria', href: '/mentoria', icon: Users },
  { name: 'Suporte', href: '/suporte', icon: HelpCircle },
];

// Mobile bottom navigation - principais telas
const mobileNavigation = [
  { name: 'Início', href: '/dashboard', icon: Home },
  { name: 'Cursos', href: '/cursos', icon: BookOpen },
  { name: 'Vagas', href: '/vagas', icon: Briefcase },
  { name: 'Perfil', href: '/perfil', icon: User },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, userRole, canAccessRoute: userCanAccessRoute } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filtrar navegação baseada nas permissões do usuário
  const filteredNavigation = navigation.filter(item => 
    userCanAccessRoute(item.href)
  );

  const filteredMobileNavigation = mobileNavigation.filter(item => 
    userCanAccessRoute(item.href)
  );

  const NavLinks = () => (
    <>
      {filteredNavigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Skip to Content - Acessibilidade */}
      <SkipToContent />

      {/* Header - Mobile optimized */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mb-6 mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{user?.name}</p>
                    {userRole && (
                      <Badge variant="secondary" className="text-xs">
                        {ROLE_LABELS[userRole]}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <nav className="flex flex-col gap-2">
                  <NavLinks />
                  
                  <Separator className="my-2" />
                  
                  {/* Link de Configurações */}
                  <Link
                    to="/configuracoes"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === '/configuracoes'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </Link>

                  <Button
                    variant="ghost"
                    className="justify-start text-muted-foreground hover:text-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sair
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg md:text-xl font-bold">CarreiraHub</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Link de Configurações - Desktop */}
            <Link to="/configuracoes" className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                title="Configurações"
                className={location.pathname === '/configuracoes' ? 'bg-muted' : ''}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Link>

            <span className="text-xs md:text-sm hidden sm:inline truncate max-w-[120px] md:max-w-none">
              {user?.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="md:hidden h-9 w-9"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex gap-6 py-4 md:py-6 px-4">
        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-4">
            {/* Informações do Usuário */}
            <div className="px-3 py-3 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              {userRole && (
                <Badge variant="secondary" className="text-xs">
                  {ROLE_LABELS[userRole]}
                </Badge>
              )}
            </div>

            <nav className="flex flex-col gap-2">
              <NavLinks />
              
              <Separator className="my-2" />
              
              {/* Link de Configurações - Sidebar Desktop */}
              <Link
                to="/configuracoes"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === '/configuracoes'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Settings className="h-4 w-4" />
                Configurações
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main 
          id="main-content"
          className="flex-1 min-w-0" 
          role="main" 
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="navigation"
        aria-label="Navegação principal"
      >
        <div className="grid grid-cols-4 h-16">
          {filteredMobileNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Barra de Ferramentas de Acessibilidade */}
      <AccessibilityToolbar />
    </div>
  );
}