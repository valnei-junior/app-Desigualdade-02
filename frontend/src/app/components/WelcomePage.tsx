import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { GraduationCap, Linkedin, Mail, Phone, Building2, BookOpen, Shield } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';
import { ROLES } from '@/app/constants/roles';

export function WelcomePage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, getHomeRoute } = useUser();

  // Redirecionar usuários autenticados para sua página inicial
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(getHomeRoute());
    }
  }, [isAuthenticated, navigate, getHomeRoute]);

  const handleQuickLoginStudent = async () => {
    // Login rápido com dados mock de estudante
    const ok = await login({
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      age: 24,
      area: 'TI',
      education: 'Superior Incompleto',
      completedCourses: ['1'],
      appliedJobs: ['1'],
      points: 250,
      badges: ['first-course', 'first-application'],
      role: ROLES.STUDENT,
    });
    if (ok) navigate('/dashboard');
  };

  const handleQuickLoginCompany = async () => {
    // Login rápido com dados mock de empresa
    const ok = await login({
      id: '2',
      name: 'Tech Solutions',
      email: 'contato@techsolutions.com',
      company: 'Tech Solutions Ltda',
      cnpj: '12.345.678/0001-90',
      area: 'Tecnologia',
      activeJobs: 5,
      role: ROLES.COMPANY,
    });
    if (ok) navigate('/vagas');
  };

  const handleQuickLoginCourseProvider = async () => {
    // Login rápido com dados mock de provedor de cursos
    const ok = await login({
      id: '3',
      name: 'EduTech Academy',
      email: 'contato@edutech.com',
      company: 'EduTech Academy',
      cnpj: '98.765.432/0001-10',
      area: 'Educação',
      role: ROLES.COURSE_PROVIDER,
    });
    if (ok) navigate('/cursos');
  };

  const handleQuickLoginAdmin = async () => {
    // Login rápido com dados mock de admin
    const ok = await login({
      id: '4',
      name: 'Administrador',
      email: 'admin@carreirahub.com',
      role: ROLES.ADMIN,
    });
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 md:mb-4 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-indigo-100">
            <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Bem-vindo!</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Sua jornada para o primeiro emprego começa aqui
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/cadastro')}
              className="w-full h-10 md:h-11 text-sm md:text-base"
              size="lg"
            >
              Cadastrar-se
            </Button>

            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="w-full h-10 md:h-11 text-sm md:text-base"
              size="lg"
            >
              Entrar
            </Button>

            <p className="text-center text-xs text-muted-foreground pt-2">
              Para acessar a plataforma, por favor faça login ou cadastre-se.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}