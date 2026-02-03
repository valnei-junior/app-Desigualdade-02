import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Switch } from '@/app/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { ROLES, ROLE_LABELS } from '@/app/constants/roles';
import { mockCourses } from '@/app/data/mockData';

const STORAGE_KEYS = {
  USERS: 'admin_users',
  COURSES: 'admin_courses',
  LOGS: 'admin_logs',
  CONTENT: 'admin_content',
  SECURITY: 'admin_security_settings',
};

function loadStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function normalizeUsers(list) {
  if (!Array.isArray(list)) return [];
  return list.map((u) => ({
    ...u,
    active: typeof u.active === 'boolean' ? u.active : true,
    locked: typeof u.locked === 'boolean' ? u.locked : false,
    suspicious: typeof u.suspicious === 'boolean' ? u.suspicious : false,
    failedLogins: Number.isFinite(u.failedLogins) ? u.failedLogins : 0,
  }));
}

function normalizeLogs(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(Boolean);
}

function normalizeContent(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(Boolean);
}

function normalizeSecuritySettings(value) {
  const fallback = {
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: false,
    maxFailedAttempts: 5,
    lockDurationMinutes: 30,
  };
  if (!value || typeof value !== 'object') return fallback;
  return {
    minPasswordLength: Number(value.minPasswordLength || fallback.minPasswordLength),
    requireUppercase: typeof value.requireUppercase === 'boolean' ? value.requireUppercase : fallback.requireUppercase,
    requireNumber: typeof value.requireNumber === 'boolean' ? value.requireNumber : fallback.requireNumber,
    requireSpecial: typeof value.requireSpecial === 'boolean' ? value.requireSpecial : fallback.requireSpecial,
    maxFailedAttempts: Number(value.maxFailedAttempts || fallback.maxFailedAttempts),
    lockDurationMinutes: Number(value.lockDurationMinutes || fallback.lockDurationMinutes),
  };
}

const ROLE_OPTIONS = Object.values(ROLES);

export function AdminPage() {
  const [users, setUsers] = React.useState(() => normalizeUsers(loadStorage(STORAGE_KEYS.USERS, [])));
  const [courses, setCourses] = React.useState(() => loadStorage(STORAGE_KEYS.COURSES, mockCourses));
  const [logs, setLogs] = React.useState(() => normalizeLogs(loadStorage(STORAGE_KEYS.LOGS, [])));
  const [contentItems, setContentItems] = React.useState(() => normalizeContent(loadStorage(STORAGE_KEYS.CONTENT, [])));
  const [securitySettings, setSecuritySettings] = React.useState(() => normalizeSecuritySettings(loadStorage(STORAGE_KEYS.SECURITY, null)));

  const [studentForm, setStudentForm] = React.useState({ id: '', name: '', email: '', area: '' });
  const [companyForm, setCompanyForm] = React.useState({ id: '', name: '', email: '', area: '' });
  const [courseForm, setCourseForm] = React.useState({ id: '', title: '', area: '', duration: '', free: true, spots: 0 });
  const [contentForm, setContentForm] = React.useState({ id: '', title: '', type: 'page', status: 'draft' });

  const [studentSearch, setStudentSearch] = React.useState('');
  const [companySearch, setCompanySearch] = React.useState('');
  const [courseSearch, setCourseSearch] = React.useState('');
  const [contentSearch, setContentSearch] = React.useState('');

  const [editingStudentId, setEditingStudentId] = React.useState(null);
  const [editingCompanyId, setEditingCompanyId] = React.useState(null);
  const [editingCourseId, setEditingCourseId] = React.useState(null);
  const [editingContentId, setEditingContentId] = React.useState(null);

  React.useEffect(() => {
    saveStorage(STORAGE_KEYS.USERS, users);
  }, [users]);

  React.useEffect(() => {
    saveStorage(STORAGE_KEYS.COURSES, courses);
  }, [courses]);

  React.useEffect(() => {
    saveStorage(STORAGE_KEYS.LOGS, logs);
  }, [logs]);

  React.useEffect(() => {
    saveStorage(STORAGE_KEYS.CONTENT, contentItems);
  }, [contentItems]);

  React.useEffect(() => {
    saveStorage(STORAGE_KEYS.SECURITY, securitySettings);
  }, [securitySettings]);

  const students = users.filter((u) => u.role === ROLES.STUDENT);
  const companies = users.filter((u) => u.role === ROLES.COMPANY);

  const filteredStudents = students.filter((u) => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return true;
    return [u.name, u.email, u.area].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
  });

  const filteredCompanies = companies.filter((u) => {
    const q = companySearch.trim().toLowerCase();
    if (!q) return true;
    return [u.name, u.email, u.area].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
  });

  const filteredCourses = courses.filter((c) => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return true;
    return [c.title, c.area, c.duration].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
  });

  const filteredContent = contentItems.filter((c) => {
    const q = contentSearch.trim().toLowerCase();
    if (!q) return true;
    return [c.title, c.type, c.status].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
  });

  const addLog = (message, type = 'info') => {
    const entry = {
      id: Date.now().toString(),
      message,
      type,
      createdAt: new Date().toISOString(),
    };
    setLogs((prev) => [entry, ...prev].slice(0, 100));
  };

  const upsertUser = (payload, role) => {
    if (!payload.name || !payload.email) return;
    const id = payload.id || Date.now().toString();
    const next = {
      id,
      name: payload.name,
      email: payload.email,
      area: payload.area || '',
      role,
      active: typeof payload.active === 'boolean' ? payload.active : true,
    };
    setUsers((prev) => {
      const exists = prev.find((u) => u.id === id);
      if (exists) addLog(`Atualizou usuário ${next.email}`, 'update');
      else addLog(`Criou usuário ${next.email}`, 'create');
      if (exists) return prev.map((u) => (u.id === id ? next : u));
      return [...prev, next];
    });
  };

  const deleteUser = (id) => {
    setUsers((prev) => {
      const target = prev.find((u) => u.id === id);
      if (target) addLog(`Excluiu usuário ${target.email}`, 'delete');
      return prev.filter((u) => u.id !== id);
    });
  };

  const setUserActive = (id, active) => setUsers((prev) => {
    const next = prev.map((u) => (u.id === id ? { ...u, active } : u));
    const target = next.find((u) => u.id === id);
    if (target) addLog(`Status de ${target.email}: ${target.active ? 'ativo' : 'inativo'}`, 'update');
    return next;
  });

  const setUserRole = (id, role) => setUsers((prev) => {
    const next = prev.map((u) => (u.id === id ? { ...u, role } : u));
    const target = next.find((u) => u.id === id);
    if (target) addLog(`Alterou perfil de ${target.email} para ${ROLE_LABELS[role] || role}`, 'update');
    return next;
  });

  const setUserLocked = (id, locked) => setUsers((prev) => {
    const next = prev.map((u) => (u.id === id ? { ...u, locked } : u));
    const target = next.find((u) => u.id === id);
    if (target) addLog(`${locked ? 'Bloqueou' : 'Desbloqueou'} ${target.email}`, 'security');
    return next;
  });

  const setUserSuspicious = (id, suspicious) => setUsers((prev) => {
    const next = prev.map((u) => (u.id === id ? { ...u, suspicious } : u));
    const target = next.find((u) => u.id === id);
    if (target) addLog(`${suspicious ? 'Marcou como suspeito' : 'Removeu suspeita'}: ${target.email}`, 'security');
    return next;
  });

  const resetFailedLogins = (id) => setUsers((prev) => {
    const next = prev.map((u) => (u.id === id ? { ...u, failedLogins: 0 } : u));
    const target = next.find((u) => u.id === id);
    if (target) addLog(`Zerou tentativas falhas de ${target.email}`, 'security');
    return next;
  });

  const resetUserPassword = (user) => {
    addLog(`Reset de senha solicitado para ${user.email}`, 'security');
    if (typeof window !== 'undefined') {
      window.alert(`Senha redefinida para ${user.email} (simulação).`);
    }
  };

  const upsertCourse = (payload) => {
    if (!payload.title || !payload.area) return;
    const id = payload.id || Date.now().toString();
    const next = {
      id,
      title: payload.title,
      area: payload.area,
      duration: payload.duration || '',
      free: !!payload.free,
      spots: Number(payload.spots || 0),
    };
    setCourses((prev) => {
      const exists = prev.find((c) => c.id === id);
      if (exists) addLog(`Atualizou curso ${next.title}`, 'update');
      else addLog(`Criou curso ${next.title}`, 'create');
      if (exists) return prev.map((c) => (c.id === id ? next : c));
      return [...prev, next];
    });
  };

  const deleteCourse = (id) => {
    setCourses((prev) => {
      const target = prev.find((c) => c.id === id);
      if (target) addLog(`Excluiu curso ${target.title}`, 'delete');
      return prev.filter((c) => c.id !== id);
    });
  };

  const upsertContent = (payload) => {
    if (!payload.title) return;
    const id = payload.id || Date.now().toString();
    const next = {
      id,
      title: payload.title,
      type: payload.type || 'page',
      status: payload.status || 'draft',
      createdAt: payload.createdAt || new Date().toISOString(),
    };
    setContentItems((prev) => {
      const exists = prev.find((c) => c.id === id);
      if (exists) addLog(`Atualizou conteúdo ${next.title}`, 'update');
      else addLog(`Criou conteúdo ${next.title}`, 'create');
      if (exists) return prev.map((c) => (c.id === id ? next : c));
      return [...prev, next];
    });
  };

  const deleteContent = (id) => {
    setContentItems((prev) => {
      const target = prev.find((c) => c.id === id);
      if (target) addLog(`Removeu conteúdo ${target.title}`, 'delete');
      return prev.filter((c) => c.id !== id);
    });
  };

  const approveContent = (id) => {
    setContentItems((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, status: 'published' } : c));
      const target = next.find((c) => c.id === id);
      if (target) addLog(`Aprovou conteúdo ${target.title}`, 'update');
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administração</h1>
        <p className="text-muted-foreground">Visão geral e gestão de cadastros</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Estudantes</CardTitle>
            <CardDescription>Total de inscritos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Empresas</CardTitle>
            <CardDescription>Total de inscritas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{companies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
            <CardDescription>Cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{courses.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList>
          <TabsTrigger value="students">Estudantes</TabsTrigger>
          <TabsTrigger value="companies">Empresas</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="logs">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Estudantes</CardTitle>
              <CardDescription>CRUD de estudantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label>Nome</Label>
                  <Input value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>E-mail</Label>
                  <Input value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Área</Label>
                  <Input value={studentForm.area} onChange={(e) => setStudentForm({ ...studentForm, area: e.target.value })} />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={() => {
                      upsertUser(studentForm, ROLES.STUDENT);
                      setStudentForm({ id: '', name: '', email: '', area: '' });
                      setEditingStudentId(null);
                    }}
                  >
                    {editingStudentId ? 'Salvar' : 'Adicionar'}
                  </Button>
                  {editingStudentId && (
                    <Button variant="outline" onClick={() => { setStudentForm({ id: '', name: '', email: '', area: '' }); setEditingStudentId(null); }}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-3">
                <div className="space-y-1 flex-1">
                  <Label>Buscar</Label>
                  <Input
                    placeholder="Nome, e-mail ou área"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.area || '-'}</TableCell>
                      <TableCell>
                        <Select value={u.role} onValueChange={(val) => setUserRole(u.id, val)}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((role) => (
                              <SelectItem key={role} value={role}>
                                {ROLE_LABELS[role] || role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={!!u.active} onCheckedChange={(val) => setUserActive(u.id, !!val)} />
                          <span className="text-sm text-muted-foreground">{u.active ? 'Ativo' : 'Inativo'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingStudentId(u.id); setStudentForm({ id: u.id, name: u.name, email: u.email, area: u.area || '' }); }}>
                          Editar
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => resetUserPassword(u)}>
                          Resetar senha
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Empresas</CardTitle>
              <CardDescription>CRUD de empresas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label>Nome</Label>
                  <Input value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>E-mail</Label>
                  <Input value={companyForm.email} onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Área</Label>
                  <Input value={companyForm.area} onChange={(e) => setCompanyForm({ ...companyForm, area: e.target.value })} />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={() => {
                      upsertUser(companyForm, ROLES.COMPANY);
                      setCompanyForm({ id: '', name: '', email: '', area: '' });
                      setEditingCompanyId(null);
                    }}
                  >
                    {editingCompanyId ? 'Salvar' : 'Adicionar'}
                  </Button>
                  {editingCompanyId && (
                    <Button variant="outline" onClick={() => { setCompanyForm({ id: '', name: '', email: '', area: '' }); setEditingCompanyId(null); }}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-3">
                <div className="space-y-1 flex-1">
                  <Label>Buscar</Label>
                  <Input
                    placeholder="Nome, e-mail ou área"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.area || '-'}</TableCell>
                      <TableCell>
                        <Select value={u.role} onValueChange={(val) => setUserRole(u.id, val)}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((role) => (
                              <SelectItem key={role} value={role}>
                                {ROLE_LABELS[role] || role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={!!u.active} onCheckedChange={(val) => setUserActive(u.id, !!val)} />
                          <span className="text-sm text-muted-foreground">{u.active ? 'Ativo' : 'Inativo'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingCompanyId(u.id); setCompanyForm({ id: u.id, name: u.name, email: u.email, area: u.area || '' }); }}>
                          Editar
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => resetUserPassword(u)}>
                          Resetar senha
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Cursos</CardTitle>
              <CardDescription>CRUD de cursos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <Label>Título</Label>
                  <Input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Área</Label>
                  <Input value={courseForm.area} onChange={(e) => setCourseForm({ ...courseForm, area: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Duração</Label>
                  <Input value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Vagas</Label>
                  <Input type="number" value={courseForm.spots} onChange={(e) => setCourseForm({ ...courseForm, spots: e.target.value })} />
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="course-free"
                      checked={courseForm.free}
                      onCheckedChange={(val) => setCourseForm({ ...courseForm, free: !!val })}
                    />
                    <Label htmlFor="course-free">Gratuito</Label>
                  </div>
                  <Button
                    onClick={() => {
                      upsertCourse(courseForm);
                      setCourseForm({ id: '', title: '', area: '', duration: '', free: true, spots: 0 });
                      setEditingCourseId(null);
                    }}
                  >
                    {editingCourseId ? 'Salvar' : 'Adicionar'}
                  </Button>
                  {editingCourseId && (
                    <Button variant="outline" onClick={() => { setCourseForm({ id: '', title: '', area: '', duration: '', free: true, spots: 0 }); setEditingCourseId(null); }}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-3">
                <div className="space-y-1 flex-1">
                  <Label>Buscar</Label>
                  <Input
                    placeholder="Título, área ou duração"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Vagas</TableHead>
                    <TableHead>Gratuito</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.title}</TableCell>
                      <TableCell>{c.area}</TableCell>
                      <TableCell>{c.duration || '-'}</TableCell>
                      <TableCell>{c.spots}</TableCell>
                      <TableCell>{c.free ? 'Sim' : 'Não'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingCourseId(c.id); setCourseForm({ id: c.id, title: c.title, area: c.area, duration: c.duration || '', free: !!c.free, spots: c.spots || 0 }); }}>
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteCourse(c.id)}>
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
              <CardDescription>Gerenciar páginas, posts e mensagens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label>Título</Label>
                  <Input value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Tipo</Label>
                  <Select value={contentForm.type} onValueChange={(val) => setContentForm({ ...contentForm, type: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page">Página</SelectItem>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="comment">Comentário</SelectItem>
                      <SelectItem value="message">Mensagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Status</Label>
                  <Select value={contentForm.status} onValueChange={(val) => setContentForm({ ...contentForm, status: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={() => {
                      upsertContent(contentForm);
                      setContentForm({ id: '', title: '', type: 'page', status: 'draft' });
                      setEditingContentId(null);
                    }}
                  >
                    {editingContentId ? 'Salvar' : 'Adicionar'}
                  </Button>
                  {editingContentId && (
                    <Button variant="outline" onClick={() => { setContentForm({ id: '', title: '', type: 'page', status: 'draft' }); setEditingContentId(null); }}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-3">
                <div className="space-y-1 flex-1">
                  <Label>Buscar</Label>
                  <Input
                    placeholder="Título, tipo ou status"
                    value={contentSearch}
                    onChange={(e) => setContentSearch(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhum conteúdo cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContent.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.title}</TableCell>
                        <TableCell>{c.type}</TableCell>
                        <TableCell className="capitalize">{c.status}</TableCell>
                        <TableCell>{c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingContentId(c.id); setContentForm({ id: c.id, title: c.title, type: c.type, status: c.status }); }}>
                            Editar
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => approveContent(c.id)}>
                            Aprovar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteContent(c.id)}>
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Políticas de senha e controle de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Mínimo de caracteres</Label>
                  <Input
                    type="number"
                    min={6}
                    value={securitySettings.minPasswordLength}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, minPasswordLength: Number(e.target.value || 0) })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Máx. tentativas falhas</Label>
                  <Input
                    type="number"
                    min={1}
                    value={securitySettings.maxFailedAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxFailedAttempts: Number(e.target.value || 0) })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Duração do bloqueio (min)</Label>
                  <Input
                    type="number"
                    min={5}
                    value={securitySettings.lockDurationMinutes}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, lockDurationMinutes: Number(e.target.value || 0) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Switch checked={securitySettings.requireUppercase} onCheckedChange={(val) => setSecuritySettings({ ...securitySettings, requireUppercase: !!val })} />
                  <Label>Exigir letra maiúscula</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={securitySettings.requireNumber} onCheckedChange={(val) => setSecuritySettings({ ...securitySettings, requireNumber: !!val })} />
                  <Label>Exigir número</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={securitySettings.requireSpecial} onCheckedChange={(val) => setSecuritySettings({ ...securitySettings, requireSpecial: !!val })} />
                  <Label>Exigir caractere especial</Label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Usuários</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Falhas</TableHead>
                      <TableHead>Suspeito</TableHead>
                      <TableHead>Bloqueado</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Nenhum usuário cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.failedLogins}</TableCell>
                          <TableCell>
                            <Switch checked={!!u.suspicious} onCheckedChange={(val) => setUserSuspicious(u.id, !!val)} />
                          </TableCell>
                          <TableCell>
                            <Switch checked={!!u.locked} onCheckedChange={(val) => setUserLocked(u.id, !!val)} />
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm" onClick={() => resetFailedLogins(u.id)}>
                              Zerar falhas
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Atividade recente</CardTitle>
              <CardDescription>Registro local das ações no painel admin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Mostrando até 100 eventos</p>
                <Button variant="outline" size="sm" onClick={() => setLogs([])}>Limpar logs</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Nenhuma atividade registrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                        <TableCell className="capitalize">{log.type}</TableCell>
                        <TableCell>{log.message}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}