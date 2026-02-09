import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { useUser } from '@/app/contexts/UserContext';
import { ROLES } from '@/app/constants/roles';
import { mockTimeline, mockAlerts } from '@/app/data/mockData';
import {
  BookOpen,
  Briefcase,
  Target,
  Bell,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  AlertTriangle,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export function Dashboard() {
  const { user } = useUser();

  if (!user) return null;

  const currentStage = mockTimeline.find(t => t.status === 'in-progress');
  const isCourseProvider = user?.role === ROLES.COURSE_PROVIDER;

  const storagePrefix = user?.id ? `course_provider_${user.id}` : 'course_provider';
  const providerData = useMemo(() => {
    if (typeof window === 'undefined') {
      return { courses: [], students: [], assessments: [], payments: [], messages: [], contentItems: [] };
    }

    const read = (suffix: string, fallback: any) => {
      const raw = localStorage.getItem(`${storagePrefix}_${suffix}`);
      try {
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    };

    return {
      courses: read('courses', []),
      students: read('students', []),
      assessments: read('assessments', []),
      payments: read('payments', []),
      messages: read('messages', []),
      contentItems: read('content', []),
      teachers: read('teachers', []),
      classes: read('classes', []),
      payroll: read('payroll', [])
    };
  }, [storagePrefix]);

  if (isCourseProvider) {
    const { courses, students, assessments, payments, messages, contentItems, teachers, classes, payroll } = providerData;
    const now = new Date();

    const totalStudents = students.length;
    const certifiedStudents = students.filter((s: any) => s.certificateIssued).length;
    const activeCourses = courses.filter((c: any) => {
      if (!c.endDate) return true;
      const end = new Date(c.endDate);
      if (Number.isNaN(end.getTime())) return true;
      return end >= now;
    }).length;

    const newStudentsToday = students.filter((s: any) => {
      if (!s.createdAt) return false;
      const d = new Date(s.createdAt);
      return d.toDateString() === now.toDateString();
    }).length;

    const newStudentsMonth = students.filter((s: any) => {
      if (!s.createdAt) return false;
      const d = new Date(s.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const revenue = payments
      .filter((p: any) => p.status === 'paid')
      .reduce((acc: number, p: any) => acc + Number(p.amount || 0), 0);

    const payrollTotal = payroll.reduce((acc: number, p: any) => acc + Number(p.salary || 0), 0);
    const paidStudents = payments.filter((p: any) => p.status === 'paid').length;
    const overdueStudents = payments.filter((p: any) => p.status !== 'paid').length;

    const averageProgress = students.length
      ? Math.round(students.reduce((acc: number, s: any) => acc + Number(s.progress || 0), 0) / students.length)
      : 0;

    const monthlyEnrollments = (() => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const counts = new Array(12).fill(0);
      students.forEach((s: any) => {
        if (!s.createdAt) return;
        const d = new Date(s.createdAt);
        if (Number.isNaN(d.getTime())) return;
        counts[d.getMonth()] += 1;
      });
      const total = counts.reduce((acc, v) => acc + v, 0);
      if (total === 0) {
        return months.slice(0, 6).map((m, idx) => ({ label: m, value: [6, 10, 8, 12, 9, 14][idx] }));
      }
      return months.slice(0, 6).map((m, idx) => ({ label: m, value: counts[idx] }));
    })();

    const courseEnrollment = courses.map((c: any) => {
      const count = students.filter((s: any) => s.courseId === c.id).length;
      return { id: c.id, title: c.title, count };
    }).sort((a: any, b: any) => b.count - a.count);

    const lowProgressStudents = students.filter((s: any) => Number(s.progress || 0) < 30).slice(0, 5);
    const nearCompletionStudents = students.filter((s: any) => Number(s.progress || 0) >= 80).slice(0, 5);
    const latestStudents = [...students].sort((a: any, b: any) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    }).slice(0, 5);

    const activeStudents = students.filter((s: any) => Number(s.progress || 0) > 0).length;
    const inactiveStudents = Math.max(0, students.length - activeStudents);

    const pendingAssessments = assessments.filter((a: any) => !(a.grades && a.grades.length)).length;
    const allGrades = assessments.flatMap((a: any) => (a.grades || []).map((g: any) => Number(g.grade || 0))).filter((g: number) => !Number.isNaN(g));
    const averageGrade = allGrades.length ? Math.round(allGrades.reduce((acc, v) => acc + v, 0) / allGrades.length) : 0;
    const approvalRate = allGrades.length ? Math.round((allGrades.filter((g: number) => g >= 70).length / allGrades.length) * 100) : 0;

    const certificatesPending = Math.max(0, students.length - certifiedStudents);

    const unansweredMessages = messages.filter((m: any) => !m.responded).length;
    const recentMessages = [...messages].slice(0, 3);

    const coursesEndingSoon = courses.filter((c: any) => {
      if (!c.endDate) return false;
      const end = new Date(c.endDate);
      if (Number.isNaN(end.getTime())) return false;
      const diffDays = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }).length;

    const pendingPayments = payments.filter((p: any) => p.status !== 'paid').length;
    const contentUpdates = contentItems.filter((c: any) => c.releaseRule === 'date' && !c.releaseValue).length;

    const maxMonthly = Math.max(...monthlyEnrollments.map((m: any) => m.value), 1);
    const maxCourse = Math.max(...courseEnrollment.map((c: any) => c.count), 1);

    return (
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard — Empresa de Cursos</h1>
          <p className="text-sm md:text-base text-muted-foreground">Visão geral da operação</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-gradient-to-br from-blue-50/60 to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">{newStudentsMonth} novos no mês</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50/60 to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos ativos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCourses}</div>
              <p className="text-xs text-muted-foreground">{courses.length} cursos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50/60 to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos alunos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newStudentsToday}</div>
              <p className="text-xs text-muted-foreground">Hoje · {newStudentsMonth} no mês</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50/60 to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos certificados</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certifiedStudents}</div>
              <p className="text-xs text-muted-foreground">{certificatesPending} pendentes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <Card className="bg-gradient-to-br from-slate-50/70 to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turmas</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-muted-foreground">Turmas ativas e planejadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50/70 to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teachers.length}</div>
              <p className="text-xs text-muted-foreground">Equipe docente cadastrada</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50/70 to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {revenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Pagamentos confirmados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          <Card className="bg-gradient-to-br from-sky-50/60 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Gráficos</CardTitle>
              <CardDescription>Visão rápida das tendências</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Inscrições por mês</p>
                <div className="space-y-2">
                  {monthlyEnrollments.map((item: any) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                      <Progress value={(item.value / maxMonthly) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Cursos mais procurados</p>
                <div className="space-y-2">
                  {courseEnrollment.slice(0, 4).map((item: any) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate max-w-[70%]">{item.title}</span>
                        <span>{item.count}</span>
                      </div>
                      <Progress value={(item.count / maxCourse) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50/60 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Taxas & Atividade</CardTitle>
              <CardDescription>Conclusão e engajamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Taxa de conclusão</p>
                <div className="flex items-center gap-3">
                  <Progress value={averageProgress} className="h-2 flex-1" />
                  <span className="text-sm text-muted-foreground">{averageProgress}%</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Alunos ativos vs. inativos</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Ativos</span>
                    <span>{activeStudents}</span>
                  </div>
                  <Progress value={students.length ? (activeStudents / students.length) * 100 : 0} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Inativos</span>
                    <span>{inactiveStudents}</span>
                  </div>
                  <Progress value={students.length ? (inactiveStudents / students.length) * 100 : 0} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <Card className="bg-gradient-to-br from-slate-50/60 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Atividade dos alunos</CardTitle>
              <CardDescription>Últimos inscritos e alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Últimos alunos inscritos</p>
                <div className="space-y-2">
                  {latestStudents.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate max-w-[60%]">{s.name || 'Aluno'}</span>
                      <span>{s.courseId ? courses.find((c: any) => c.id === s.courseId)?.title || 'Curso' : 'Curso'}</span>
                    </div>
                  ))}
                  {!latestStudents.length && <p className="text-xs text-muted-foreground">Sem inscrições recentes.</p>}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Progresso baixo</p>
                <div className="space-y-2">
                  {lowProgressStudents.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate max-w-[60%]">{s.name || 'Aluno'}</span>
                      <span>{s.progress || 0}%</span>
                    </div>
                  ))}
                  {!lowProgressStudents.length && <p className="text-xs text-muted-foreground">Nenhum alerta.</p>}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Próximos de concluir</p>
                <div className="space-y-2">
                  {nearCompletionStudents.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate max-w-[60%]">{s.name || 'Aluno'}</span>
                      <span>{s.progress || 0}%</span>
                    </div>
                  ))}
                  {!nearCompletionStudents.length && <p className="text-xs text-muted-foreground">Nenhum aluno perto da conclusão.</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50/60 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status dos cursos</CardTitle>
              <CardDescription>Adesão e atenção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Cursos ativos</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Em andamento</span>
                  <span>{activeCourses}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Cursos com mais alunos</p>
                <div className="space-y-2">
                  {courseEnrollment.slice(0, 3).map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate max-w-[70%]">{c.title}</span>
                      <span>{c.count}</span>
                    </div>
                  ))}
                  {!courseEnrollment.length && <p className="text-xs text-muted-foreground">Nenhum curso cadastrado.</p>}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Baixa adesão</p>
                <div className="space-y-2">
                  {courseEnrollment.filter((c: any) => c.count < 3).slice(0, 3).map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate max-w-[70%]">{c.title}</span>
                      <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {c.count}</span>
                    </div>
                  ))}
                  {!courseEnrollment.filter((c: any) => c.count < 3).length && <p className="text-xs text-muted-foreground">Nenhum curso em alerta.</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50/60 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Avaliações</CardTitle>
              <CardDescription>Notas e correções</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Média geral</span>
                <span>{averageGrade} pts</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Pendentes de correção</span>
                <span>{pendingAssessments}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Taxa de aprovação</span>
                <span>{approvalRate}%</span>
              </div>
              <Progress value={approvalRate} className="h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <Card className="bg-gradient-to-br from-rose-50/60 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Certificados</CardTitle>
              <CardDescription>Status de emissão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Emitidos</span>
                <span>{certifiedStudents}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Pendentes</span>
                <span>{certificatesPending}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50/60 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Comunicação</CardTitle>
              <CardDescription>Mensagens recentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Mensagens não respondidas</span>
                <span>{unansweredMessages}</span>
              </div>
              <div className="space-y-1">
                {recentMessages.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span className="truncate">{m.title}</span>
                  </div>
                ))}
                {!recentMessages.length && <p className="text-xs text-muted-foreground">Nenhum aviso enviado.</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50/60 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Alertas e lembretes</CardTitle>
              <CardDescription>Ações pendentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Cursos próximos do encerramento</span>
                <span>{coursesEndingSoon}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Pagamentos pendentes</span>
                <span>{pendingPayments}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Atualizações no conteúdo</span>
                <span>{contentUpdates}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50/60 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Financeiro</CardTitle>
              <CardDescription>Salários e situação dos alunos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Salários (total)</span>
                <span>R$ {payrollTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Alunos em dia</span>
                <span>{paidStudents}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Alunos atrasados</span>
                <span>{overdueStudents}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-slate-50/60 to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ações rápidas</CardTitle>
            <CardDescription>Atalhos para tarefas do dia</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link to="/cursos">
              <Button size="sm" className="gap-2"><BookOpen className="h-4 w-4" />Criar novo curso</Button>
            </Link>
            <Link to="/cursos">
              <Button size="sm" variant="outline" className="gap-2"><Users className="h-4 w-4" />Cadastrar aluno</Button>
            </Link>
            <Link to="/financeiro">
              <Button size="sm" variant="outline" className="gap-2"><DollarSign className="h-4 w-4" />Financeiro</Button>
            </Link>
            <Link to="/cursos">
              <Button size="sm" variant="outline" className="gap-2"><MessageSquare className="h-4 w-4" />Enviar comunicado</Button>
            </Link>
            <Link to="/cursos">
              <Button size="sm" variant="outline" className="gap-2"><CheckCircle2 className="h-4 w-4" />Emitir certificado</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Olá, {user.name}! 👋</h1>
        <p className="text-sm md:text-base text-muted-foreground">Veja seu progresso na jornada</p>
      </div>

      {/* Trilha: Curso → Estágio → Emprego (oculto para empresas) */}
      {user?.role !== ROLES.COMPANY && (
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
      )}

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

      {/* Indicador de Chance de Contratação (oculto para empresas) */}
      {user?.role !== ROLES.COMPANY && (
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
      )}
    </div>
  );
}