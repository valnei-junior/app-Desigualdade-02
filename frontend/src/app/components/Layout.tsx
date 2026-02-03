import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { useUser } from '@/app/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { ROLES, ROLE_LABELS } from '@/app/constants/roles';
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
  DollarSign,
  LogOut,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/app/components/ui/sheet';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/app/components/ui/carousel';
import partnerLogo1 from '@/assets/partners/partner-1.png';
import partnerLogo2 from '@/assets/partners/partner-2.jpg';
import partnerLogo3 from '@/assets/partners/partner-3.jpg';
import partnerLogo4 from '@/assets/partners/partner-4.jpg';
import partnerLogo5 from '@/assets/partners/partner-5.avif';
import partnerLogo6 from '@/assets/partners/partner-6.jpg';
import partnerLogo7 from '@/assets/partners/partner-7.jpg';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Cursos', href: '/cursos', icon: BookOpen },
  { name: 'Vagas', href: '/vagas', icon: Briefcase },
  { name: 'Alertas', href: '/alertas', icon: Bell },
  { name: 'Linha do Tempo', href: '/linha-do-tempo', icon: TrendingUp },
  { name: 'Empresas', href: '/empresas', icon: Building2 },
  { name: 'Perfil', href: '/perfil', icon: User },
  { name: 'Métricas', href: '/metricas', icon: BarChart3 },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
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
  const { user, logout, canAccessRoute, updateUser } = useUser();
  const [partnerCarouselApi, setPartnerCarouselApi] = useState<CarouselApi | null>(null);
  const [roleChoice, setRoleChoice] = useState<string>(user?.role || ROLES.COURSE_PROVIDER);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const partnerLogos = [
    { name: 'Parceira 1', logo: partnerLogo1 },
    { name: 'Parceira 2', logo: partnerLogo2 },
    { name: 'Parceira 3', logo: partnerLogo3 },
    { name: 'Parceira 4', logo: partnerLogo4 },
    { name: 'Parceira 5', logo: partnerLogo5 },
    { name: 'Parceira 6', logo: partnerLogo6 },
    { name: 'Parceira 7', logo: partnerLogo7 },
  ];

  useEffect(() => {
    if (!partnerCarouselApi) return;
    const id = setInterval(() => {
      partnerCarouselApi.scrollNext();
    }, 3000);
    return () => clearInterval(id);
  }, [partnerCarouselApi]);

  useEffect(() => {
    if (user?.role) setRoleChoice(user.role);
  }, [user?.role]);

  const roleOptions = useMemo(() => (Object.values(ROLES)), []);

  const NavLinks = () => (
    <>
      {navigation.filter((item) => !canAccessRoute || canAccessRoute(item.href)).map((item) => {
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
                <div className="mb-6 mt-4">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <nav className="flex flex-col gap-2">
                  <NavLinks />
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
          <div className="sticky top-20">
            <nav className="flex flex-col gap-2">
              <NavLinks />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {!user?.role && (
            <Card className="mb-6 border-amber-200 bg-amber-50/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm md:text-base">Defina o tipo de conta</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Seu cadastro antigo não tinha o tipo de conta salvo. Escolha para liberar as funções.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-3 md:items-center">
                <Select value={roleChoice} onValueChange={setRoleChoice}>
                  <SelectTrigger className="md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>{ROLE_LABELS[role]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => updateUser({ role: roleChoice })}>Salvar tipo de conta</Button>
              </CardContent>
            </Card>
          )}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl">Empresas Parceiras</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Logos de empresas que trabalham conosco
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel
                opts={{ align: 'start', loop: true }}
                className="w-full"
                setApi={setPartnerCarouselApi}
              >
                <CarouselContent>
                  {partnerLogos.map((item) => (
                    <CarouselItem key={item.name} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
                      <div className="flex items-center justify-center border rounded-lg p-4 h-24 bg-muted/30">
                        <div className="flex items-center justify-center w-full h-full">
                          <img src={item.logo} alt="Logo da empresa parceira" className="h-full w-full object-contain" />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </CardContent>
          </Card>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="grid grid-cols-4 h-16">
          {mobileNavigation.filter((item) => !canAccessRoute || canAccessRoute(item.href)).map((item) => {
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
              >
                <Icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}