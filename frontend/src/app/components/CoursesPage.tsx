import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Switch } from '@/app/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { useUser } from '@/app/contexts/UserContext';
import { ROLES } from '@/app/constants/roles';
import { mockCourses } from '@/app/data/mockData';
import { BookOpen, Calendar, Clock, Users, Filter, FileText, GraduationCap, MessageSquare, Award } from 'lucide-react';
import { toast } from 'sonner';

const defaultLessonsForCourse = (title: string) => ([
  { id: 'l1', title: `${title} · Introdução`, duration: '08:30' },
  { id: 'l2', title: `${title} · Fundamentos`, duration: '12:10' },
  { id: 'l3', title: `${title} · Projeto prático`, duration: '15:45' },
]);

export function CoursesPage() {
  const { user, updateUser } = useUser();
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    area: 'all',
    free: 'all',
    search: '',
  });

  const isCourseProvider = user?.role === ROLES.COURSE_PROVIDER;

  const storagePrefix = useMemo(() => {
    if (!user?.id) return 'course_provider';
    return `course_provider_${user.id}`;
  }, [user?.id]);

  const [courses, setCourses] = useState(() => {
    if (typeof window === 'undefined') return mockCourses;
    const raw = localStorage.getItem(`${storagePrefix}_courses`);
    return raw ? JSON.parse(raw) : mockCourses;
  });

  const [students, setStudents] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_students`);
    return raw ? JSON.parse(raw) : [];
  });

  const [contentItems, setContentItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_content`);
    return raw ? JSON.parse(raw) : [];
  });

  const [assessments, setAssessments] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_assessments`);
    return raw ? JSON.parse(raw) : [];
  });

  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_messages`);
    return raw ? JSON.parse(raw) : [];
  });


  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') return { instructorName: '', institutionName: '', role: 'instrutor', notifications: true };
    const raw = localStorage.getItem(`${storagePrefix}_settings`);
    return raw ? JSON.parse(raw) : { instructorName: '', institutionName: '', role: 'instrutor', notifications: true };
  });

  const [teachers, setTeachers] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_teachers`);
    return raw ? JSON.parse(raw) : [];
  });

  const [classes, setClasses] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_classes`);
    return raw ? JSON.parse(raw) : [];
  });


  const [courseForm, setCourseForm] = useState({
    id: '',
    title: '',
    description: '',
    area: 'TI',
    duration: '',
    hours: 0,
    modality: 'online',
    free: true,
    price: '',
    startDate: '',
    endDate: '',
  });

  const [studentFilter, setStudentFilter] = useState({ courseId: 'all', status: 'all' });
  const [contentForm, setContentForm] = useState({ courseId: '', module: '', lesson: '', type: 'video', releaseRule: 'date', releaseValue: '' });
  const [assessmentForm, setAssessmentForm] = useState({ courseId: '', title: '', type: 'quiz', criteria: '' });
  const [gradeForm, setGradeForm] = useState({ assessmentId: '', studentId: '', grade: '' });
  const [messageForm, setMessageForm] = useState({ courseId: '', title: '', body: '' });
  const [teacherForm, setTeacherForm] = useState({ id: '', name: '', specialty: '' });
  const [classForm, setClassForm] = useState({ id: '', name: '', courseId: '', startDate: '', teacherId: '' });

  const getStudentStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: any }> = {
      pending: { label: 'Aguardando análise', variant: 'secondary' },
      approved: { label: 'Aprovado', variant: 'default' },
      rejected: { label: 'Reprovado', variant: 'destructive' },
    };
    const item = config[status] || config.pending;
    return <Badge variant={item.variant} className="text-xs">{item.label}</Badge>;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_courses`, JSON.stringify(courses));
  }, [courses, storagePrefix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_students`, JSON.stringify(students));
  }, [students, storagePrefix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_content`, JSON.stringify(contentItems));
  }, [contentItems, storagePrefix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_assessments`, JSON.stringify(assessments));
  }, [assessments, storagePrefix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_messages`, JSON.stringify(messages));
  }, [messages, storagePrefix]);


  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_settings`, JSON.stringify(settings));
  }, [settings, storagePrefix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_teachers`, JSON.stringify(teachers));
  }, [teachers, storagePrefix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_classes`, JSON.stringify(classes));
  }, [classes, storagePrefix]);


  const filteredCourses = courses.filter(course => {
    if (filter.area !== 'all' && course.area !== filter.area) return false;
    if (filter.free === 'free' && !course.free) return false;
    if (filter.free === 'paid' && course.free) return false;
    if (filter.search && !course.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleEnroll = (course: any) => {
    const previous = Array.isArray(user?.enrolledCourses) ? user.enrolledCourses : [];
    if (previous.some((c: any) => c.id === course.id)) {
      setOverlayMessage('Você já se inscreveu neste curso.');
      return;
    }

    toast.success(`Inscrição realizada em "${course.title}"!`);
    if (updateUser) {
      const enrollment = {
        id: course.id,
        title: course.title,
        area: course.area,
        startDate: course.startDate,
        duration: course.duration,
        status: 'Inscrição enviada',
        progress: 0,
        lessons: defaultLessonsForCourse(course.title),
      };
      const nextCourses = [enrollment, ...previous.filter((c: any) => c.id !== course.id)];
      updateUser({ enrolledCourses: nextCourses });
    }
  };

  if (isCourseProvider) {
    const filteredStudents = students.filter((s) => {
      if (studentFilter.courseId !== 'all' && s.courseId !== studentFilter.courseId) return false;
      if (studentFilter.status !== 'all' && s.status !== studentFilter.status) return false;
      return true;
    });

    const handleSaveCourse = () => {
      if (!courseForm.title || !courseForm.description) return;
      const id = courseForm.id || Date.now().toString();
      const next = { ...courseForm, id, hours: Number(courseForm.hours || 0), free: !!courseForm.free };
      setCourses((prev) => {
        const exists = prev.find((c) => c.id === id);
        if (exists) return prev.map((c) => (c.id === id ? next : c));
        return [...prev, next];
      });
      setCourseForm({ id: '', title: '', description: '', area: 'TI', duration: '', hours: 0, modality: 'online', free: true, price: '', startDate: '', endDate: '' });
      toast.success('Curso salvo com sucesso.');
    };

    const handleDeleteCourse = (id: string) => {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success('Curso removido.');
    };

    const handleApproveStudent = (id: string) => setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s)));
    const handleRejectStudent = (id: string) => setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s)));
    const handleCancelEnrollment = (id: string) => setStudents((prev) => prev.filter((s) => s.id !== id));

    const handleAddContent = () => {
      if (!contentForm.courseId || !contentForm.module || !contentForm.lesson) return;
      const next = { ...contentForm, id: Date.now().toString() };
      setContentItems((prev) => [next, ...prev]);
      setContentForm({ courseId: '', module: '', lesson: '', type: 'video', releaseRule: 'date', releaseValue: '' });
    };

    const handleAddAssessment = () => {
      if (!assessmentForm.courseId || !assessmentForm.title) return;
      const next = { ...assessmentForm, id: Date.now().toString() };
      setAssessments((prev) => [next, ...prev]);
      setAssessmentForm({ courseId: '', title: '', type: 'quiz', criteria: '' });
    };

    const handleAddGrade = () => {
      if (!gradeForm.assessmentId || !gradeForm.studentId) return;
      setAssessments((prev) => prev.map((a) => {
        if (a.id !== gradeForm.assessmentId) return a;
        const grades = a.grades || [];
        const nextGrades = grades.some((g) => g.studentId === gradeForm.studentId)
          ? grades.map((g) => (g.studentId === gradeForm.studentId ? { ...g, grade: gradeForm.grade } : g))
          : [...grades, { studentId: gradeForm.studentId, grade: gradeForm.grade }];
        return { ...a, grades: nextGrades };
      }));
      setGradeForm({ assessmentId: '', studentId: '', grade: '' });
    };

    const handleSendMessage = () => {
      if (!messageForm.title || !messageForm.body) return;
      const next = { ...messageForm, id: Date.now().toString(), createdAt: new Date().toISOString() };
      setMessages((prev) => [next, ...prev]);
      setMessageForm({ courseId: '', title: '', body: '' });
    };


    const handleAddTeacher = () => {
      if (!teacherForm.name) return;
      const id = teacherForm.id || Date.now().toString();
      const next = { ...teacherForm, id };
      setTeachers((prev) => {
        const exists = prev.find((t) => t.id === id);
        if (exists) return prev.map((t) => (t.id === id ? next : t));
        return [next, ...prev];
      });
      setTeacherForm({ id: '', name: '', specialty: '' });
    };

    const handleDeleteTeacher = (id: string) => {
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    };

    const handleAddClass = () => {
      if (!classForm.name) return;
      const id = classForm.id || Date.now().toString();
      const next = { ...classForm, id };
      setClasses((prev) => {
        const exists = prev.find((c) => c.id === id);
        if (exists) return prev.map((c) => (c.id === id ? next : c));
        return [next, ...prev];
      });
      setClassForm({ id: '', name: '', courseId: '', startDate: '', teacherId: '' });
    };

    const handleDeleteClass = (id: string) => {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    };

    return (
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gestão de Cursos</h1>
          <p className="text-sm md:text-base text-muted-foreground">Painel da empresa prestadora de cursos</p>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-64 shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Submenu</CardTitle>
                  <CardDescription>Escolha uma área para gerenciar</CardDescription>
                </CardHeader>
                <CardContent>
                  <TabsList className="flex flex-col w-full h-auto gap-2 bg-transparent">
                    <TabsTrigger value="courses" className="justify-start gap-2 w-full">
                      <BookOpen className="h-4 w-4" />
                      Cursos
                    </TabsTrigger>
                    <TabsTrigger value="students" className="justify-start gap-2 w-full">
                      <Users className="h-4 w-4" />
                      Alunos
                    </TabsTrigger>
                    <TabsTrigger value="content" className="justify-start gap-2 w-full">
                      <FileText className="h-4 w-4" />
                      Conteúdo
                    </TabsTrigger>
                    <TabsTrigger value="assessments" className="justify-start gap-2 w-full">
                      <GraduationCap className="h-4 w-4" />
                      Avaliações
                    </TabsTrigger>
                    <TabsTrigger value="progress" className="justify-start gap-2 w-full">
                      <Calendar className="h-4 w-4" />
                      Acompanhamento
                    </TabsTrigger>
                    <TabsTrigger value="certificates" className="justify-start gap-2 w-full">
                      <Award className="h-4 w-4" />
                      Certificados
                    </TabsTrigger>
                    <TabsTrigger value="communication" className="justify-start gap-2 w-full">
                      <MessageSquare className="h-4 w-4" />
                      Comunicação
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="justify-start gap-2 w-full">
                      <Filter className="h-4 w-4" />
                      Configurações
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 min-w-0">
              <TabsContent value="courses" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de cursos</CardTitle>
                <CardDescription>Criar, editar e excluir cursos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input placeholder="Título" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
                  <Input placeholder="Descrição" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
                  <Select value={courseForm.area} onValueChange={(val) => setCourseForm({ ...courseForm, area: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TI">Tecnologia</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Administração">Administração</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Duração" value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} />
                  <Input type="number" placeholder="Carga horária" value={courseForm.hours} onChange={(e) => setCourseForm({ ...courseForm, hours: Number(e.target.value) })} />
                  <Select value={courseForm.modality} onValueChange={(val) => setCourseForm({ ...courseForm, modality: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={courseForm.free} onCheckedChange={(val) => setCourseForm({ ...courseForm, free: !!val })} />
                    <span className="text-sm">Gratuito</span>
                  </div>
                  <Input placeholder="Valor" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} />
                  <Input type="date" value={courseForm.startDate} onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })} />
                  <Input type="date" value={courseForm.endDate} onChange={(e) => setCourseForm({ ...courseForm, endDate: e.target.value })} />
                </div>
                <Button onClick={handleSaveCourse}>Salvar curso</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cursos cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Carga horária</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.modality || '-'}</TableCell>
                        <TableCell>{course.hours || '-'}</TableCell>
                        <TableCell>{course.free ? 'Gratuito' : course.price || 'Pago'}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="secondary" size="sm">
                            <Link to={`/cursos/${course.id}`}>Abrir página</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="ml-2" onClick={() => setCourseForm({ ...course, id: course.id })}>Editar</Button>
                          <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteCourse(course.id)}>Excluir</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
              </TabsContent>

              <TabsContent value="students" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de alunos</CardTitle>
                <CardDescription>Aprovar, recusar e cancelar matrículas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select value={studentFilter.courseId} onValueChange={(val) => setStudentFilter({ ...studentFilter, courseId: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os cursos</SelectItem>
                      {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={studentFilter.status} onValueChange={(val) => setStudentFilter({ ...studentFilter, status: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="pending">Aguardando análise</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Reprovado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{s.progress || 0}%</TableCell>
                        <TableCell>{getStudentStatusBadge(s.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleApproveStudent(s.id)}>Aprovar</Button>
                          <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleRejectStudent(s.id)}>Recusar</Button>
                          <Button variant="outline" size="sm" className="ml-2" onClick={() => handleCancelEnrollment(s.id)}>Cancelar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do curso</CardTitle>
                <CardDescription>Enviar aulas e organizar módulos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select value={contentForm.courseId} onValueChange={(val) => setContentForm({ ...contentForm, courseId: val })}>
                    <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Módulo" value={contentForm.module} onChange={(e) => setContentForm({ ...contentForm, module: e.target.value })} />
                  <Input placeholder="Lição" value={contentForm.lesson} onChange={(e) => setContentForm({ ...contentForm, lesson: e.target.value })} />
                  <Select value={contentForm.type} onValueChange={(val) => setContentForm({ ...contentForm, type: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="slide">Slides</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={contentForm.releaseRule} onValueChange={(val) => setContentForm({ ...contentForm, releaseRule: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Liberar por data</SelectItem>
                      <SelectItem value="progress">Liberar por progresso</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Data/Progresso" value={contentForm.releaseValue} onChange={(e) => setContentForm({ ...contentForm, releaseValue: e.target.value })} />
                </div>
                <Button onClick={handleAddContent}>Adicionar conteúdo</Button>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Lição</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentItems.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{courses.find((co) => co.id === c.courseId)?.title || '-'}</TableCell>
                        <TableCell>{c.module}</TableCell>
                        <TableCell>{c.lesson}</TableCell>
                        <TableCell>{c.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
              </TabsContent>

              <TabsContent value="assessments" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações</CardTitle>
                <CardDescription>Provas, atividades e quizzes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select value={assessmentForm.courseId} onValueChange={(val) => setAssessmentForm({ ...assessmentForm, courseId: val })}>
                    <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Título" value={assessmentForm.title} onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })} />
                  <Select value={assessmentForm.type} onValueChange={(val) => setAssessmentForm({ ...assessmentForm, type: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="prova">Prova</SelectItem>
                      <SelectItem value="atividade">Atividade</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Critérios de aprovação" value={assessmentForm.criteria} onChange={(e) => setAssessmentForm({ ...assessmentForm, criteria: e.target.value })} />
                </div>
                <Button onClick={handleAddAssessment}>Criar avaliação</Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select value={gradeForm.assessmentId} onValueChange={(val) => setGradeForm({ ...gradeForm, assessmentId: val })}>
                    <SelectTrigger><SelectValue placeholder="Avaliação" /></SelectTrigger>
                    <SelectContent>
                      {assessments.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={gradeForm.studentId} onValueChange={(val) => setGradeForm({ ...gradeForm, studentId: val })}>
                    <SelectTrigger><SelectValue placeholder="Aluno" /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Nota" value={gradeForm.grade} onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })} />
                </div>
                <Button variant="outline" onClick={handleAddGrade}>Lançar nota</Button>
              </CardContent>
            </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Acompanhamento</CardTitle>
                <CardDescription>Progresso e frequência</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Frequência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.progress || 0}%</TableCell>
                        <TableCell>{s.attendance || 0}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
              </TabsContent>

              <TabsContent value="certificates" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Certificados</CardTitle>
                <CardDescription>Emitir e enviar certificados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.certificateIssued ? 'Emitido' : 'Pendente'}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => setStudents((prev) => prev.map((st) => (st.id === s.id ? { ...st, certificateIssued: true } : st)))}>
                            Emitir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
              </TabsContent>

              <TabsContent value="communication" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Comunicação</CardTitle>
                <CardDescription>Avisos e mensagens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select value={messageForm.courseId} onValueChange={(val) => setMessageForm({ ...messageForm, courseId: val })}>
                    <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="Título" value={messageForm.title} onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })} />
                  <Input placeholder="Mensagem" value={messageForm.body} onChange={(e) => setMessageForm({ ...messageForm, body: e.target.value })} />
                </div>
                <Button onClick={handleSendMessage}>Enviar aviso</Button>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.title}</TableCell>
                        <TableCell>{courses.find((c) => c.id === m.courseId)?.title || '-'}</TableCell>
                        <TableCell>{new Date(m.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Perfil e permissões</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Nome do instrutor" value={settings.instructorName} onChange={(e) => setSettings({ ...settings, instructorName: e.target.value })} />
                <Input placeholder="Instituição" value={settings.institutionName} onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })} />
                <Select value={settings.role} onValueChange={(val) => setSettings({ ...settings, role: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instrutor">Instrutor</SelectItem>
                    <SelectItem value="coordenador">Coordenador</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Switch checked={settings.notifications} onCheckedChange={(val) => setSettings({ ...settings, notifications: !!val })} />
                  <span className="text-sm">Notificações ativas</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professores</CardTitle>
                <CardDescription>Cadastro rápido de docentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="Nome" value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} />
                  <Input placeholder="Especialidade" value={teacherForm.specialty} onChange={(e) => setTeacherForm({ ...teacherForm, specialty: e.target.value })} />
                </div>
                <Button onClick={handleAddTeacher}>Adicionar professor</Button>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Professor</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.name}</TableCell>
                        <TableCell>{t.specialty || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setTeacherForm({ id: t.id, name: t.name, specialty: t.specialty || '' })}>Editar</Button>
                          <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteTeacher(t.id)}>Excluir</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Turmas</CardTitle>
                <CardDescription>Organização de turmas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input placeholder="Nome da turma" value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} />
                  <Select value={classForm.courseId} onValueChange={(val) => setClassForm({ ...classForm, courseId: val })}>
                    <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={classForm.teacherId} onValueChange={(val) => setClassForm({ ...classForm, teacherId: val })}>
                    <SelectTrigger><SelectValue placeholder="Professor" /></SelectTrigger>
                    <SelectContent>
                      {teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input type="date" value={classForm.startDate} onChange={(e) => setClassForm({ ...classForm, startDate: e.target.value })} />
                </div>
                <Button onClick={handleAddClass}>Adicionar turma</Button>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Turma</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{courses.find((co) => co.id === c.courseId)?.title || '-'}</TableCell>
                        <TableCell>{teachers.find((t) => t.id === c.teacherId)?.name || '-'}</TableCell>
                        <TableCell>{c.startDate || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setClassForm({ id: c.id, name: c.name, courseId: c.courseId || '', startDate: c.startDate || '', teacherId: c.teacherId || '' })}>Editar</Button>
                          <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteClass(c.id)}>Excluir</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {overlayMessage && (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <div className="bg-background border shadow-lg rounded-lg p-4 w-full max-w-sm text-center space-y-2">
            <p className="text-sm font-medium">{overlayMessage}</p>
            <Button size="sm" onClick={() => setOverlayMessage(null)}>Fechar</Button>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Cursos Disponíveis</h1>
        <p className="text-sm md:text-base text-muted-foreground">Aprenda novas habilidades e impulsione sua carreira</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Filter className="h-4 w-4 md:h-5 md:w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium">Buscar</label>
              <Input
                placeholder="Nome do curso..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="h-9 md:h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium">Área</label>
              <Select
                value={filter.area}
                onValueChange={(value) => setFilter({ ...filter, area: value })}
              >
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as áreas</SelectItem>
                  <SelectItem value="TI">Tecnologia</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium">Tipo</label>
              <Select
                value={filter.free}
                onValueChange={(value) => setFilter({ ...filter, free: value })}
              >
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="free">Gratuitos</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base md:text-lg line-clamp-2">{course.title}</CardTitle>
                {course.free && (
                  <Badge variant="secondary" className="text-xs shrink-0">Gratuito</Badge>
                )}
              </div>
              <CardDescription className="text-xs md:text-sm line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <BookOpen className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <span>{course.area}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <span>Início: {course.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <span>Duração: {course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Users className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <span>{course.spots} vagas</span>
                </div>

                <Button
                  onClick={() => handleEnroll(course)}
                  className="w-full mt-3 md:mt-4 h-9 md:h-10 text-sm"
                >
                  Inscrever-se em 1 clique
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="py-8 md:py-12 text-center">
            <p className="text-sm md:text-base text-muted-foreground">
              Nenhum curso encontrado com os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}