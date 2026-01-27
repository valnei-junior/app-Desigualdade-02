import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { useUser } from '@/app/contexts/UserContext';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MetricsPage() {
  const { user } = useUser();

  const completionData = [
    { month: 'Set', value: 20 },
    { month: 'Out', value: 40 },
    { month: 'Nov', value: 65 },
    { month: 'Dez', value: 80 },
    { month: 'Jan', value: 100 },
  ];

  const applicationData = [
    { month: 'Set', applications: 0 },
    { month: 'Out', applications: 1 },
    { month: 'Nov', applications: 2 },
    { month: 'Dez', applications: 3 },
    { month: 'Jan', applications: 5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Métricas Pessoais</h1>
        <p className="text-muted-foreground">Acompanhe seu progresso e desempenho</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Taxa de Conclusão
            </CardTitle>
            <CardDescription>Cursos concluídos vs. iniciados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Cursos Concluídos</span>
                  <span className="text-2xl font-bold">{(user?.completedCourses?.length || 0) * 100}%</span>
                </div>
                <Progress value={(user?.completedCourses?.length || 0) * 100} />
              </div>
              <p className="text-sm text-muted-foreground">
                Você concluiu {user?.completedCourses?.length || 0} de {user?.completedCourses?.length || 0} cursos iniciados
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Indicador de Contratação
            </CardTitle>
            <CardDescription>Probabilidade baseada em histórico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Chance de Contratação</span>
                  <span className="text-2xl font-bold">78%</span>
                </div>
                <Progress value={78} className="h-3" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Perfil completo</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cursos relevantes</span>
                  <span className="font-medium">70%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Experiências</span>
                  <span className="font-medium">80%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução de Conclusão de Cursos</CardTitle>
          <CardDescription>Progresso ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidaturas ao Longo do Tempo</CardTitle>
          <CardDescription>Número de candidaturas enviadas por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4" />
              Meta Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">3/5</p>
            <Progress value={60} />
            <p className="text-xs text-muted-foreground mt-2">Candidaturas este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4" />
              Pontuação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">{user?.points || 0}</p>
            <p className="text-xs text-muted-foreground">Pontos acumulados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2 text-green-600">+25%</p>
            <p className="text-xs text-muted-foreground">Comparado ao mês anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}