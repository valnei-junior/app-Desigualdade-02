import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { useUser } from '@/app/contexts/UserContext.jsx';
import { ROLES } from '@/app/constants/roles';

export function StudentIndicationsPage() {
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

  const [enrollments, setEnrollments] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_enrollments`);
    return raw ? JSON.parse(raw) : [];
  });

  const [companies, setCompanies] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_partner_companies`);
    return raw ? JSON.parse(raw) : [];
  });

  const [companyForm, setCompanyForm] = useState({ name: '', area: '' });
  const [filters, setFilters] = useState({ courseId: 'all', status: 'all', search: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_enrollments`, JSON.stringify(enrollments));
  }, [enrollments, storagePrefix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_partner_companies`, JSON.stringify(companies));
  }, [companies, storagePrefix]);

  const handleAddCompany = () => {
    if (!companyForm.name) return;
    const next = { ...companyForm, id: Date.now().toString() };
    setCompanies((prev) => [next, ...prev]);
    setCompanyForm({ name: '', area: '' });
  };

  const handleToggleInclude = (id, value) => {
    setEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, indicateInclude: value } : e)));
  };

  const handleUpdateIndication = (id, updates) => {
    setEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const handleSendIndication = (id) => {
    setEnrollments((prev) => prev.map((e) => (
      e.id === id
        ? { ...e, indicationStatus: 'sent', indicationDate: new Date().toISOString() }
        : e
    )));
  };

  const filteredEnrollments = enrollments.filter((e) => {
    if (filters.courseId !== 'all' && e.courseId !== filters.courseId) return false;
    if (filters.status !== 'all' && (e.indicationStatus || 'pending') !== filters.status) return false;
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const name = (e.name || '').toLowerCase();
      const matricula = (e.matricula || '').toLowerCase();
      if (!name.includes(term) && !matricula.includes(term)) return false;
    }
    return true;
  });

  if (!isCourseProvider) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Indicações</CardTitle>
          <CardDescription>Área exclusiva para empresas de cursos</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">Acesso restrito</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Indicação para empresas</h1>
        <p className="text-sm md:text-base text-muted-foreground">Envie alunos diretamente para empresas parceiras</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empresas parceiras</CardTitle>
          <CardDescription>Cadastre empresas para indicação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Nome da empresa" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} />
            <Input placeholder="Área/segmento" value={companyForm.area} onChange={(e) => setCompanyForm({ ...companyForm, area: e.target.value })} />
          </div>
          <Button onClick={handleAddCompany}>Adicionar empresa</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="Buscar por aluno ou matrícula" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <Select value={filters.courseId} onValueChange={(val) => setFilters({ ...filters, courseId: val })}>
            <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cursos</SelectItem>
              {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
              <SelectItem value="accepted">Aceito</SelectItem>
              <SelectItem value="rejected">Recusado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alunos para indicação</CardTitle>
          <CardDescription>Marque se o aluno pode ser indicado e envie</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicar</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <Checkbox checked={!!e.indicateInclude} onCheckedChange={(val) => handleToggleInclude(e.id, !!val)} />
                  </TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.matricula}</TableCell>
                  <TableCell>{courses.find((c) => c.id === e.courseId)?.title || '-'}</TableCell>
                  <TableCell>{e.phone}</TableCell>
                  <TableCell>
                    <Badge variant={e.indicationStatus === 'sent' ? 'secondary' : e.indicationStatus === 'accepted' ? 'default' : e.indicationStatus === 'rejected' ? 'destructive' : 'outline'}>
                      {e.indicationStatus || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={e.indicationCompanyId || ''} onValueChange={(val) => handleUpdateIndication(e.id, { indicationCompanyId: val })}>
                      <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                      <SelectContent>
                        {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Observações" value={e.indicationNotes || ''} onChange={(ev) => handleUpdateIndication(e.id, { indicationNotes: ev.target.value })} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleSendIndication(e.id)} disabled={!e.indicateInclude}>
                      Enviar
                    </Button>
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
