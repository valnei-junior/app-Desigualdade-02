import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { useUser } from '@/app/contexts/UserContext.jsx';
import { ROLES } from '@/app/constants/roles';

const emptyEnrollment = {
  id: '',
  courseId: '',
  matricula: '',
  name: '',
  phone: '',
  address: '',
  cpf: '',
  rg: '',
  entryPeriod: '',
  module: '',
  classId: '',
  teacherId: '',
  courseEndDate: '',
  moduleEndDate: '',
  status: 'pending',
};

export function CourseDetailsPage() {
  const { courseId } = useParams();
  const { user } = useUser();
  const isCourseProvider = user?.role === ROLES.COURSE_PROVIDER || user?.role === ROLES.ADMIN;

  const storagePrefix = useMemo(() => {
    if (!user?.id) return 'course_provider';
    return `course_provider_${user.id}`;
  }, [user?.id]);

  const [courses] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_courses`);
    return raw ? JSON.parse(raw) : [];
  });

  const [teachers] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_teachers`);
    return raw ? JSON.parse(raw) : [];
  });

  const [classes] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_classes`);
    return raw ? JSON.parse(raw) : [];
  });

  const [settings] = useState(() => {
    if (typeof window === 'undefined') return { role: 'instrutor' };
    const raw = localStorage.getItem(`${storagePrefix}_settings`);
    return raw ? JSON.parse(raw) : { role: 'instrutor' };
  });

  const [enrollments, setEnrollments] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_enrollments`);
    return raw ? JSON.parse(raw) : [];
  });

  const [enrollmentForm, setEnrollmentForm] = useState({ ...emptyEnrollment, courseId: courseId || '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_enrollments`, JSON.stringify(enrollments));
  }, [enrollments, storagePrefix]);

  const course = courses.find((c) => c.id === courseId);
  const courseClasses = classes.filter((c) => c.courseId === courseId);
  const courseEnrollments = enrollments.filter((e) => e.courseId === courseId);

  const isInstructorView = settings?.role === 'instrutor';

  const generateMatricula = () => `MAT-${Date.now().toString().slice(-6)}`;

  const handleSaveEnrollment = () => {
    if (!courseId || !enrollmentForm.name) return;
    const id = enrollmentForm.id || Date.now().toString();
    const proposed = enrollmentForm.matricula || generateMatricula();
    const hasDuplicate = enrollments.some((e) => e.matricula === proposed && e.id !== id);
    const matricula = hasDuplicate ? generateMatricula() : proposed;
    const next = { ...enrollmentForm, id, courseId, matricula };
    setEnrollments((prev) => {
      const exists = prev.find((e) => e.id === id);
      if (exists) return prev.map((e) => (e.id === id ? next : e));
      return [next, ...prev];
    });
    setEnrollmentForm({ ...emptyEnrollment, courseId });
  };

  const handleDeleteEnrollment = (id) => {
    setEnrollments((prev) => prev.filter((e) => e.id !== id));
  };

  if (!isCourseProvider) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Curso</CardTitle>
          <CardDescription>Área exclusiva para empresas de cursos</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Acesso restrito</Badge>
        </CardContent>
      </Card>
    );
  }

  if (!course) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Curso não encontrado</CardTitle>
          <CardDescription>Volte para a lista de cursos</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/cursos">
            <Button>Voltar</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
          <p className="text-sm md:text-base text-muted-foreground">Página do curso</p>
        </div>
        <Link to="/cursos">
          <Button variant="outline">Voltar para cursos</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Turmas</CardTitle>
          <CardDescription>Lista de turmas e professores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Turma</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Início</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseClasses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{teachers.find((t) => t.id === c.teacherId)?.name || '-'}</TableCell>
                  <TableCell>{c.startDate || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alunos matriculados</CardTitle>
          <CardDescription>Dados completos e situação acadêmica</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Nome do aluno" value={enrollmentForm.name} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, name: e.target.value })} />
            <Input placeholder="Matrícula (única)" value={enrollmentForm.matricula} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, matricula: e.target.value })} />
            <Input placeholder="Telefone" value={enrollmentForm.phone} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, phone: e.target.value })} />
            <Input placeholder="Endereço" value={enrollmentForm.address} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, address: e.target.value })} />
            {!isInstructorView && (
              <>
                <Input placeholder="CPF" value={enrollmentForm.cpf} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, cpf: e.target.value })} />
                <Input placeholder="RG" value={enrollmentForm.rg} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, rg: e.target.value })} />
              </>
            )}
            <Input placeholder="Período de entrada" value={enrollmentForm.entryPeriod} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, entryPeriod: e.target.value })} />
            <Input placeholder="Módulo atual" value={enrollmentForm.module} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, module: e.target.value })} />
            <Select value={enrollmentForm.classId} onValueChange={(val) => setEnrollmentForm({ ...enrollmentForm, classId: val })}>
              <SelectTrigger><SelectValue placeholder="Turma" /></SelectTrigger>
              <SelectContent>
                {courseClasses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={enrollmentForm.teacherId} onValueChange={(val) => setEnrollmentForm({ ...enrollmentForm, teacherId: val })}>
              <SelectTrigger><SelectValue placeholder="Professor" /></SelectTrigger>
              <SelectContent>
                {teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={enrollmentForm.courseEndDate} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, courseEndDate: e.target.value })} />
            <Input type="date" value={enrollmentForm.moduleEndDate} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, moduleEndDate: e.target.value })} />
            <Select value={enrollmentForm.status} onValueChange={(val) => setEnrollmentForm({ ...enrollmentForm, status: val })}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Em andamento</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="reproved">Reprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSaveEnrollment}>{enrollmentForm.id ? 'Atualizar aluno' : 'Adicionar aluno'}</Button>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matrícula</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                {!isInstructorView && <TableHead>CPF</TableHead>}
                {!isInstructorView && <TableHead>RG</TableHead>}
                <TableHead>Período</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Término curso</TableHead>
                <TableHead>Término módulo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseEnrollments.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.matricula}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.phone}</TableCell>
                  <TableCell>{e.address}</TableCell>
                  {!isInstructorView && <TableCell>{e.cpf}</TableCell>}
                  {!isInstructorView && <TableCell>{e.rg}</TableCell>}
                  <TableCell>{e.entryPeriod}</TableCell>
                  <TableCell>{e.module}</TableCell>
                  <TableCell>{teachers.find((t) => t.id === e.teacherId)?.name || '-'}</TableCell>
                  <TableCell>{courseClasses.find((c) => c.id === e.classId)?.name || '-'}</TableCell>
                  <TableCell>{e.courseEndDate || '-'}</TableCell>
                  <TableCell>{e.moduleEndDate || '-'}</TableCell>
                  <TableCell>{e.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setEnrollmentForm({ ...e })}>Editar</Button>
                    <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteEnrollment(e.id)}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
