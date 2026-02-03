import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { useUser } from '@/app/contexts/UserContext.jsx';
import { ROLES } from '@/app/constants/roles';

export function FinancePage() {
  const { user } = useUser();
  const isCourseProvider = user?.role === ROLES.COURSE_PROVIDER || user?.role === ROLES.ADMIN;

  const storagePrefix = useMemo(() => {
    if (!user?.id) return 'course_provider';
    return `course_provider_${user.id}`;
  }, [user?.id]);

  const [courses, setCourses] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_courses`);
    return raw ? JSON.parse(raw) : [];
  });

  const [payments, setPayments] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_payments`);
    return raw ? JSON.parse(raw) : [];
  });

  const [payroll, setPayroll] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(`${storagePrefix}_payroll`);
    return raw ? JSON.parse(raw) : [];
  });

  const [paymentForm, setPaymentForm] = useState({ studentName: '', courseId: '', amount: '', status: 'paid' });
  const [payrollForm, setPayrollForm] = useState({ employee: '', role: '', salary: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_courses`, JSON.stringify(courses));
  }, [courses, storagePrefix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_payments`, JSON.stringify(payments));
  }, [payments, storagePrefix]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${storagePrefix}_payroll`, JSON.stringify(payroll));
  }, [payroll, storagePrefix]);

  const handleAddPayment = () => {
    if (!paymentForm.courseId || !paymentForm.studentName || !paymentForm.amount) return;
    const next = { ...paymentForm, id: Date.now().toString(), date: new Date().toISOString() };
    setPayments((prev) => [next, ...prev]);
    setPaymentForm({ studentName: '', courseId: '', amount: '', status: 'paid' });
  };

  const handleAddPayroll = () => {
    if (!payrollForm.employee || !payrollForm.salary) return;
    const next = { ...payrollForm, id: Date.now().toString() };
    setPayroll((prev) => [next, ...prev]);
    setPayrollForm({ employee: '', role: '', salary: '' });
  };

  const paidStudents = payments.filter((p) => p.status === 'paid').length;
  const overdueStudents = payments.filter((p) => p.status !== 'paid').length;
  const payrollTotal = payroll.reduce((acc, p) => acc + Number(p.salary || 0), 0);

  if (!isCourseProvider) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financeiro</CardTitle>
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
        <h1 className="text-2xl md:text-3xl font-bold">Financeiro</h1>
        <p className="text-sm md:text-base text-muted-foreground">Pagamentos, salários e situação dos alunos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-emerald-50/60 to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Salários (total)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {payrollTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Folha de pagamento</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50/60 to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alunos em dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidStudents}</div>
            <p className="text-xs text-muted-foreground">Pagamentos confirmados</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-rose-50/60 to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alunos atrasados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueStudents}</div>
            <p className="text-xs text-muted-foreground">Pagamentos pendentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagamentos de alunos</CardTitle>
          <CardDescription>Controle de parcelas e situação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Aluno" value={paymentForm.studentName} onChange={(e) => setPaymentForm({ ...paymentForm, studentName: e.target.value })} />
            <Select value={paymentForm.courseId} onValueChange={(val) => setPaymentForm({ ...paymentForm, courseId: val })}>
              <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
              <SelectContent>
                {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Valor" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={paymentForm.status} onValueChange={(val) => setPaymentForm({ ...paymentForm, status: val })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Em dia</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddPayment}>Registrar pagamento</Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.studentName}</TableCell>
                  <TableCell>{courses.find((c) => c.id === p.courseId)?.title || '-'}</TableCell>
                  <TableCell>{p.amount}</TableCell>
                  <TableCell>{p.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Folha de pagamento</CardTitle>
          <CardDescription>Salários dos funcionários</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Funcionário" value={payrollForm.employee} onChange={(e) => setPayrollForm({ ...payrollForm, employee: e.target.value })} />
            <Input placeholder="Cargo" value={payrollForm.role} onChange={(e) => setPayrollForm({ ...payrollForm, role: e.target.value })} />
            <Input placeholder="Salário" value={payrollForm.salary} onChange={(e) => setPayrollForm({ ...payrollForm, salary: e.target.value })} />
          </div>
          <Button onClick={handleAddPayroll}>Adicionar salário</Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Salário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payroll.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.employee}</TableCell>
                  <TableCell>{p.role || '-'}</TableCell>
                  <TableCell>{p.salary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
