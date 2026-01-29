import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { useUser } from '@/app/contexts/UserContext';
import { mockTimeline, mockAlerts } from '@/app/data/mockData';
import { BookOpen, Briefcase, Target, Bell, Award, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { user } = useUser();

  if (!user) return null;

  const currentStage = mockTimeline.find(t => t.status === 'in-progress');

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Olá, {user.name}! 👋</h1>
        <p className="text-sm md:text-base text-muted-foreground">Veja seu progresso na jornada</p>
      </div>

      {/* Trilha: Curso → Estágio → Emprego */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Sua Trilha de Carreira</CardTitle>
          <CardDescription className="text-xs md:text-sm">Curso → Estágio → Emprego</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {mockTimeline.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 md:gap-4">
                <div className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full shrink-0 ${
                  item.status === 'completed' ? 'bg-green-100 text-green-600' :
                  item.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {idx === 0 ? <BookOpen className="h-4 w-4 md:h-5 md:w-5" /> :
                   idx === 1 ? <Briefcase className="h-4 w-4 md:h-5 md:w-5" /> :
                   <Target className="h-4 w-4 md:h-5 md:w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm md:text-base truncate">{item.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <Badge variant={
                      item.status === 'completed' ? 'default' :
                      item.status === 'in-progress' ? 'secondary' :
                      'outline'
                    } className="text-xs shrink-0">
                      {item.status === 'completed' ? 'Concluído' :
                       item.status === 'in-progress' ? 'Em andamento' :
                       'Pendente'}
                    </Badge>
                  </div>
                  <Progress value={item.progress} className="mt-2 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status da Candidatura */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cursos Concluídos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.completedCourses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +1 este mês
            </p>
            <Link to="/cursos">
              <Button variant="link" className="px-0 mt-2 h-auto text-xs md:text-sm">
                Ver cursos disponíveis →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Candidaturas Enviadas
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.appliedJobs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              2 aguardando resposta
            </p>
            <Link to="/vagas">
              <Button variant="link" className="px-0 mt-2 h-auto text-xs md:text-sm">
                Ver vagas compatíveis →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pontos de Gamificação
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.points || 0}</div>
            <p className="text-xs text-muted-foreground">
              {user.badges?.length || 0} badges conquistados
            </p>
            <Link to="/gamificacao">
              <Button variant="link" className="px-0 mt-2 h-auto text-xs md:text-sm">
                Ver conquistas →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Recentes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl">Alertas Recentes</CardTitle>
            <Link to="/alertas">
              <Button variant="outline" size="sm" className="h-8 text-xs md:text-sm">
                <Bell className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Ver todos
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {mockAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg border">
                <div className={`flex h-2 w-2 rounded-full mt-2 shrink-0 ${
                  alert.read ? 'bg-gray-300' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base">{alert.title}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Indicador de Chance de Contratação */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
            Chance de Contratação
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Baseado em seu perfil e histórico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm font-medium">Perfil completo</span>
                <span className="text-xs md:text-sm text-muted-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm font-medium">Cursos relevantes</span>
                <span className="text-xs md:text-sm text-muted-foreground">70%</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div className="pt-3 md:pt-4 border-t">
              <p className="text-xs md:text-sm text-muted-foreground">
                Complete mais cursos e atualize seu perfil para aumentar suas chances!
              </p>
              <Link to="/perfil">
                <Button variant="link" className="px-0 mt-2 h-auto text-xs md:text-sm">
                  Ir para perfil →
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}