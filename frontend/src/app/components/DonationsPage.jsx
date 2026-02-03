import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { useUser } from '@/app/contexts/UserContext.jsx';
import { ROLES } from '@/app/constants/roles';
import QRCode from 'qrcode';

const PLAN_CONFIG = {
  [ROLES.STUDENT]: {
    name: 'Doação Mensal Estudante',
    price: 20,
    description: 'Doação recorrente mensal para manter acesso à plataforma.',
  },
  [ROLES.COMPANY]: {
    name: 'Plano Empresa',
    price: 50,
    description: 'Pagamento mensal fixo para acesso empresarial.',
  },
  [ROLES.COURSE_PROVIDER]: {
    name: 'Plano Prestador de Curso',
    price: 50,
    description: 'Pagamento mensal fixo para prestadores de cursos.',
  },
};

export function DonationsPage() {
  const { user } = useUser();

  const storagePrefix = useMemo(() => {
    if (!user?.id) return 'donations';
    return `donations_${user.id}`;
  }, [user?.id]);

  const [payments, setPayments] = useState(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('donations_payments');
    return raw ? JSON.parse(raw) : [];
  });

  const [pixKey, setPixKey] = useState('senac@gmail.com');
  const [pixName, setPixName] = useState('CarreiraHub');
  const [pixCity, setPixCity] = useState('Sao Paulo');
  const [pixQr, setPixQr] = useState('');
  const [pixError, setPixError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('donations_payments', JSON.stringify(payments));
  }, [payments]);

  const currentRole = user?.role || ROLES.STUDENT;
  const plan = PLAN_CONFIG[currentRole];

  const myPayments = payments.filter((p) => p.userId === user?.id);
  const lastPayment = myPayments[0];
  const isPaid = lastPayment?.status === 'paid';

  const totals = payments.reduce(
    (acc, p) => {
      if (p.status === 'paid') acc.total += Number(p.amount || 0);
      acc.count += 1;
      return acc;
    },
    { total: 0, count: 0 }
  );

  const handlePay = () => {
    if (!user) return;
    const amount = plan?.price || 20;
    const next = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      role: currentRole,
      amount,
      status: 'paid',
      date: new Date().toISOString(),
    };
    setPayments((prev) => [next, ...prev]);
  };

  const buildPixPayload = () => {
    const amount = plan?.price || 0;
    return `PIX|key=${pixKey}|name=${pixName}|city=${pixCity}|amount=${amount.toFixed(2)}`;
  };

  const handleGeneratePix = async () => {
    try {
      setPixError('');
      const payload = buildPixPayload();
      const dataUrl = await QRCode.toDataURL(payload);
      setPixQr(dataUrl);
    } catch (err) {
      setPixError('Não foi possível gerar o QR Code.');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Doações e Planos</h1>
        <p className="text-sm md:text-base text-muted-foreground">Planos por perfil e status de pagamento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{plan?.name || 'Plano'}</CardTitle>
            <CardDescription>{plan?.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold">R$ {plan?.price || 0},00</div>
            <div>
              <Badge variant={isPaid ? 'default' : 'destructive'}>
                {isPaid ? 'Pagamento em dia' : 'Pagamento pendente'}
              </Badge>
            </div>
            <Button onClick={handlePay}>Pagar mensalidade</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagamento via PIX</CardTitle>
            <CardDescription>Gere um QR Code para pagamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Chave PIX" value={pixKey} onChange={(e) => setPixKey(e.target.value)} />
              <Input placeholder="Beneficiário" value={pixName} onChange={(e) => setPixName(e.target.value)} />
              <Input placeholder="Cidade" value={pixCity} onChange={(e) => setPixCity(e.target.value)} />
            </div>
            <Button variant="outline" onClick={handleGeneratePix}>Gerar QR Code</Button>
            {pixError && <p className="text-sm text-red-600">{pixError}</p>}
            {pixQr && (
              <div className="flex justify-center">
                <img src={pixQr} alt="QR Code PIX" className="h-40 w-40" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meu histórico</CardTitle>
            <CardDescription>Visualização restrita ao próprio usuário</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>R$ {Number(p.amount || 0).toFixed(2)}</TableCell>
                    <TableCell>{p.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {currentRole === ROLES.ADMIN && (
        <Card>
          <CardHeader>
            <CardTitle>Visão Administrativa</CardTitle>
            <CardDescription>Acesso total ao financeiro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-4">
              <div className="bg-muted/40 rounded-lg px-4 py-3">
                <p className="text-xs text-muted-foreground">Total arrecadado</p>
                <p className="text-xl font-bold">R$ {totals.total.toFixed(2)}</p>
              </div>
              <div className="bg-muted/40 rounded-lg px-4 py-3">
                <p className="text-xs text-muted-foreground">Pagamentos registrados</p>
                <p className="text-xl font-bold">{totals.count}</p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.userName}</TableCell>
                    <TableCell>{p.role}</TableCell>
                    <TableCell>R$ {Number(p.amount || 0).toFixed(2)}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{new Date(p.date).toLocaleDateString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
