import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Progress } from '@/app/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  Filter,
  Flag,
  History,
  Layers,
  MessageSquare,
  Monitor,
  Pin,
  PinOff,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  User,
  Users,
  Volume2,
  VolumeX,
  XCircle,
  RefreshCw,
  Activity,
  Cpu,
  HardDrive,
  Server,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  UserCheck,
  KeyRound,
  Smartphone,
  Settings,
  Bug,
  Package,
  BarChart3,
  TrendingDown,
  DollarSign,
  Receipt,
  FileWarning,
  MessageCircle,
  CalendarDays,
  ListTodo,
  CheckSquare,
  Loader2,
} from 'lucide-react';

/* ───────────────────────── types ───────────────────────── */

type AlertPriority = 'critical' | 'warning' | 'info';
type AlertCategory =
  | 'security'
  | 'users'
  | 'system'
  | 'financial'
  | 'content'
  | 'tasks';

interface Alert {
  id: string;
  title: string;
  message: string;
  category: AlertCategory;
  priority: AlertPriority;
  tags: string[];
  timestamp: Date;
  read: boolean;
  pinned: boolean;
  muted: boolean;
}

/* ─────────────── seed data (mock) ─────────────── */

const now = new Date();
const m = (min: number) => new Date(now.getTime() - min * 60_000);

const SEED_ALERTS: Alert[] = [
  // ── Alertas Críticos – Segurança ──
  { id: 'c1', title: 'Tentativas suspeitas de login', message: '14 tentativas de login falharam para o IP 189.40.xx.xx nos últimos 5 minutos.', category: 'security', priority: 'critical', tags: ['urgente', 'segurança'], timestamp: m(2), read: false, pinned: true, muted: false },
  { id: 'c2', title: 'Múltiplas falhas de autenticação', message: 'Conta admin@carreirahub.com.br registrou 8 falhas consecutivas de senha.', category: 'security', priority: 'critical', tags: ['urgente', 'segurança'], timestamp: m(5), read: false, pinned: false, muted: false },
  { id: 'c3', title: 'Conta bloqueada automaticamente', message: 'O sistema bloqueou a conta maria.silva@email.com após 10 tentativas inválidas.', category: 'security', priority: 'critical', tags: ['urgente', 'segurança'], timestamp: m(8), read: false, pinned: false, muted: false },
  { id: 'c4', title: 'Possível ataque de brute force', message: 'Detectado padrão de brute force vindo de 3 IPs distintos no endpoint /api/login.', category: 'security', priority: 'critical', tags: ['urgente', 'segurança'], timestamp: m(12), read: false, pinned: true, muted: false },

  // ── Alertas Críticos – Infraestrutura ──
  { id: 'c5', title: 'Falha em backup automático', message: 'O backup agendado das 03:00 falhou — disco cheio no servidor de armazenamento.', category: 'system', priority: 'critical', tags: ['urgente', 'sistema'], timestamp: m(30), read: false, pinned: false, muted: false },
  { id: 'c6', title: 'Servidor fora do ar', message: 'O serviço api-prod-02 não responde desde 14:32. Restart automático em andamento.', category: 'system', priority: 'critical', tags: ['urgente', 'sistema'], timestamp: m(18), read: false, pinned: true, muted: false },
  { id: 'c7', title: 'Uso excessivo de CPU', message: 'CPU em 97% há mais de 10 minutos no servidor principal. Investigação necessária.', category: 'system', priority: 'critical', tags: ['urgente', 'sistema'], timestamp: m(15), read: false, pinned: false, muted: false },
  { id: 'c8', title: 'Queda no desempenho do sistema', message: 'Tempo de resposta médio saltou de 120ms para 2.4s nos últimos 15 minutos.', category: 'system', priority: 'critical', tags: ['urgente', 'sistema'], timestamp: m(10), read: false, pinned: false, muted: false },

  // ── Usuários & Acessos ──
  { id: 'u1', title: 'Novo usuário cadastrado', message: 'João Pedro (joao.pedro@email.com) se cadastrou como Estudante.', category: 'users', priority: 'info', tags: ['usuários'], timestamp: m(3), read: false, pinned: false, muted: false },
  { id: 'u2', title: 'Alteração de permissões', message: 'As permissões de carlos.admin foram alteradas de Mentor para Admin.', category: 'users', priority: 'warning', tags: ['usuários', 'segurança'], timestamp: m(20), read: false, pinned: false, muted: false },
  { id: 'u3', title: 'Redefinição de senha solicitada', message: 'ana.costa@email.com solicitou redefinição de senha via e-mail.', category: 'users', priority: 'info', tags: ['usuários'], timestamp: m(25), read: true, pinned: false, muted: false },
  { id: 'u4', title: 'Login em novo dispositivo', message: 'rafael.santos fez login a partir de um iPhone em São Paulo — dispositivo não reconhecido.', category: 'users', priority: 'warning', tags: ['usuários', 'segurança'], timestamp: m(40), read: false, pinned: false, muted: false },
  { id: 'u5', title: 'Conta desativada', message: 'A conta empresa_xyz@corp.com foi desativada por inatividade (90 dias).', category: 'users', priority: 'warning', tags: ['usuários'], timestamp: m(60), read: true, pinned: false, muted: false },

  // ── Sistema & Infraestrutura (não-críticos) ──
  { id: 's1', title: 'Atualizações disponíveis', message: 'Há 3 dependências com atualizações de segurança pendentes (react-router, express, sqlite3).', category: 'system', priority: 'warning', tags: ['sistema'], timestamp: m(90), read: true, pinned: false, muted: false },
  { id: 's2', title: 'Erros internos do sistema', message: '12 erros 500 registrados na última hora no endpoint /api/auth/forgot-password.', category: 'system', priority: 'warning', tags: ['sistema'], timestamp: m(45), read: false, pinned: false, muted: false },
  { id: 's3', title: 'Falha em processo agendado', message: 'O cron de limpeza de tokens expirados falhou às 02:00.', category: 'system', priority: 'warning', tags: ['sistema'], timestamp: m(120), read: true, pinned: false, muted: false },
  { id: 's4', title: 'Reinício do servidor', message: 'O servidor api-prod-01 foi reiniciado automaticamente após OOM (Out of Memory).', category: 'system', priority: 'warning', tags: ['sistema'], timestamp: m(55), read: false, pinned: false, muted: false },
  { id: 's5', title: 'Alerta de performance', message: 'A fila de e-mails atingiu 250 itens pendentes. Verifique o serviço SMTP.', category: 'system', priority: 'warning', tags: ['sistema'], timestamp: m(35), read: false, pinned: false, muted: false },
  { id: 's6', title: 'Serviço externo fora do ar', message: 'O gateway de pagamento (Stripe) está retornando timeout desde 14:00.', category: 'system', priority: 'critical', tags: ['urgente', 'sistema', 'financeiro'], timestamp: m(22), read: false, pinned: false, muted: false },

  // ── Financeiro & Transações ──
  { id: 'f1', title: 'Pagamento recusado', message: 'A mensalidade de empresa_abc foi recusada pelo cartão final *4821.', category: 'financial', priority: 'warning', tags: ['financeiro'], timestamp: m(50), read: false, pinned: false, muted: false },
  { id: 'f2', title: 'Nova transação concluída', message: 'PIX de R$ 29,90 recebido de lucas.dev@email.com (plano Estudante).', category: 'financial', priority: 'info', tags: ['financeiro'], timestamp: m(7), read: false, pinned: false, muted: false },
  { id: 'f3', title: 'Estorno solicitado', message: 'mariana.oliveira@email.com solicitou estorno de R$ 49,90 — motivo: cobrança dupla.', category: 'financial', priority: 'warning', tags: ['financeiro'], timestamp: m(70), read: false, pinned: false, muted: false },
  { id: 'f4', title: 'Tentativa de fraude detectada', message: 'Cartão com dados inconsistentes usado 3× em 2 minutos. Transações bloqueadas.', category: 'financial', priority: 'critical', tags: ['urgente', 'financeiro', 'segurança'], timestamp: m(13), read: false, pinned: true, muted: false },
  { id: 'f5', title: 'Queda na taxa de conversão', message: 'A taxa de conversão de pagamentos caiu 18% nas últimas 24h.', category: 'financial', priority: 'warning', tags: ['financeiro'], timestamp: m(180), read: true, pinned: false, muted: false },

  // ── Conteúdo & Moderação ──
  { id: 'm1', title: 'Conteúdo denunciado', message: 'Post #4821 recebeu 5 denúncias por "informação falsa".', category: 'content', priority: 'warning', tags: ['moderação'], timestamp: m(33), read: false, pinned: false, muted: false },
  { id: 'm2', title: 'Pedido de exclusão de conta', message: 'felipe.gomes@email.com solicitou exclusão da conta e dados (LGPD).', category: 'content', priority: 'warning', tags: ['moderação', 'usuários'], timestamp: m(80), read: false, pinned: false, muted: false },
  { id: 'm3', title: 'Comentários aguardando moderação', message: '7 comentários pendentes de aprovação no curso "React Avançado".', category: 'content', priority: 'info', tags: ['moderação'], timestamp: m(42), read: true, pinned: false, muted: false },
  { id: 'm4', title: 'Conteúdo sensível detectado', message: 'O filtro automático bloqueou um upload com possível conteúdo inadequado.', category: 'content', priority: 'warning', tags: ['moderação', 'segurança'], timestamp: m(28), read: false, pinned: false, muted: false },

  // ── Tarefas & Lembretes ──
  { id: 't1', title: 'Tarefas pendentes', message: 'Você tem 4 tarefas atrasadas: revisão de cursos, aprovação de empresas e mais.', category: 'tasks', priority: 'warning', tags: ['tarefas'], timestamp: m(100), read: false, pinned: false, muted: false },
  { id: 't2', title: 'Evento programado', message: 'Manutenção agendada para amanhã (06/02) das 02:00 às 04:00.', category: 'tasks', priority: 'info', tags: ['tarefas', 'sistema'], timestamp: m(200), read: true, pinned: true, muted: false },
  { id: 't3', title: 'Processo em andamento', message: 'Migração de banco de dados: 68% concluída — estimativa: 12 minutos restantes.', category: 'tasks', priority: 'info', tags: ['tarefas', 'sistema'], timestamp: m(6), read: false, pinned: false, muted: false },
  { id: 't4', title: 'Ação concluída recentemente', message: 'Backup completo do banco de dados finalizado com sucesso às 14:00.', category: 'tasks', priority: 'info', tags: ['tarefas'], timestamp: m(150), read: true, pinned: false, muted: false },
];

/* ─────────────── helpers ─────────────── */

const CATEGORY_META: Record<AlertCategory, { label: string; icon: React.ReactNode; color: string }> = {
  security: { label: 'Segurança', icon: <ShieldAlert className="h-4 w-4" />, color: 'text-red-500' },
  users:    { label: 'Usuários & Acessos', icon: <Users className="h-4 w-4" />, color: 'text-blue-500' },
  system:   { label: 'Sistema & Infra', icon: <Server className="h-4 w-4" />, color: 'text-orange-500' },
  financial:{ label: 'Financeiro', icon: <CreditCard className="h-4 w-4" />, color: 'text-emerald-500' },
  content:  { label: 'Conteúdo & Moderação', icon: <MessageSquare className="h-4 w-4" />, color: 'text-purple-500' },
  tasks:    { label: 'Tarefas & Lembretes', icon: <ListTodo className="h-4 w-4" />, color: 'text-sky-500' },
};

const PRIORITY_META: Record<AlertPriority, { label: string; badge: string; dot: string }> = {
  critical: { label: 'Crítico', badge: 'bg-red-500/15 text-red-600 border-red-500/30', dot: 'bg-red-500' },
  warning:  { label: 'Aviso',   badge: 'bg-amber-500/15 text-amber-600 border-amber-500/30', dot: 'bg-amber-500' },
  info:     { label: 'Info',    badge: 'bg-blue-500/15 text-blue-600 border-blue-500/30', dot: 'bg-blue-500' },
};

function timeAgo(date: Date): string {
  const diff = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (diff < 1) return 'agora';
  if (diff < 60) return `${diff}min atrás`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

function getCategoryIcon(alert: Alert): React.ReactNode {
  // More specific icons based on alert id/title
  const t = alert.title.toLowerCase();
  if (t.includes('login') || t.includes('autenticação')) return <Lock className="h-5 w-5" />;
  if (t.includes('bloqueada')) return <XCircle className="h-5 w-5" />;
  if (t.includes('ataque') || t.includes('brute') || t.includes('ddos')) return <ShieldAlert className="h-5 w-5" />;
  if (t.includes('backup')) return <HardDrive className="h-5 w-5" />;
  if (t.includes('servidor') || t.includes('fora do ar')) return <Server className="h-5 w-5" />;
  if (t.includes('cpu') || t.includes('memória')) return <Cpu className="h-5 w-5" />;
  if (t.includes('desempenho') || t.includes('performance')) return <Activity className="h-5 w-5" />;
  if (t.includes('novo usuário') || t.includes('cadastrado')) return <UserPlus className="h-5 w-5" />;
  if (t.includes('permissões') || t.includes('alteração de perfil')) return <UserCheck className="h-5 w-5" />;
  if (t.includes('redefinição') || t.includes('senha')) return <KeyRound className="h-5 w-5" />;
  if (t.includes('dispositivo')) return <Smartphone className="h-5 w-5" />;
  if (t.includes('desativada') || t.includes('suspensa')) return <UserMinus className="h-5 w-5" />;
  if (t.includes('atualização') || t.includes('atualizações')) return <RefreshCw className="h-5 w-5" />;
  if (t.includes('erros internos') || t.includes('erro')) return <Bug className="h-5 w-5" />;
  if (t.includes('cron') || t.includes('agendado')) return <Package className="h-5 w-5" />;
  if (t.includes('reinício')) return <RefreshCw className="h-5 w-5" />;
  if (t.includes('serviço externo')) return <WifiOff className="h-5 w-5" />;
  if (t.includes('pagamento recusado')) return <XCircle className="h-5 w-5" />;
  if (t.includes('transação')) return <Receipt className="h-5 w-5" />;
  if (t.includes('estorno')) return <RefreshCw className="h-5 w-5" />;
  if (t.includes('fraude')) return <AlertTriangle className="h-5 w-5" />;
  if (t.includes('conversão')) return <TrendingDown className="h-5 w-5" />;
  if (t.includes('denunciado')) return <Flag className="h-5 w-5" />;
  if (t.includes('exclusão')) return <Trash2 className="h-5 w-5" />;
  if (t.includes('comentários')) return <MessageCircle className="h-5 w-5" />;
  if (t.includes('sensível')) return <FileWarning className="h-5 w-5" />;
  if (t.includes('pendentes') || t.includes('tarefas')) return <ListTodo className="h-5 w-5" />;
  if (t.includes('evento') || t.includes('manutenção')) return <CalendarDays className="h-5 w-5" />;
  if (t.includes('andamento') || t.includes('migração')) return <Loader2 className="h-5 w-5 animate-spin" />;
  if (t.includes('concluída') || t.includes('concluído')) return <CheckSquare className="h-5 w-5" />;
  return <Bell className="h-5 w-5" />;
}

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(SEED_ALERTS);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | AlertPriority>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | AlertCategory>('all');
  const [showHistory, setShowHistory] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ── derived ── */
  const allTags = useMemo(() => {
    const set = new Set<string>();
    alerts.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [alerts]);

  const filtered = useMemo(() => {
    return alerts
      .filter((a) => {
        if (activeTab !== 'all' && a.category !== activeTab) return false;
        if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false;
        if (tagFilter !== 'all' && !a.tags.includes(tagFilter)) return false;
        if (!showHistory && a.read) return false;
        if (search) {
          const q = search.toLowerCase();
          return a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q) || a.tags.some((t) => t.includes(q));
        }
        return true;
      })
      .sort((a, b) => {
        // pinned first, then by timestamp desc
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }, [alerts, activeTab, priorityFilter, tagFilter, search, showHistory]);

  const counts = useMemo(() => {
    const c = { critical: 0, warning: 0, info: 0 };
    alerts.filter((a) => !a.read).forEach((a) => c[a.priority]++);
    return c;
  }, [alerts]);

  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = {};
    alerts.filter((a) => !a.read).forEach((a) => { c[a.category] = (c[a.category] || 0) + 1; });
    return c;
  }, [alerts]);

  /* ── actions ── */
  const toggleRead = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a)));
  const togglePin = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));
  const toggleMute = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, muted: !a.muted } : a)));
  const markAllRead = () =>
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  const deleteAlert = (id: string) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  /* ═══════════════════════════ RENDER ═══════════════════════════ */

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Central de Alertas
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitoramento em tempo real do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
            <History className="h-4 w-4 mr-1" />
            {showHistory ? 'Ocultar lidos' : 'Histórico'}
          </Button>
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Marcar tudo como lido
          </Button>
        </div>
      </div>

      {/* ── Dashboard resumido (topo) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Críticos */}
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="py-4 px-5 flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-500/15">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{counts.critical}</p>
              <p className="text-xs text-muted-foreground">Alertas críticos</p>
            </div>
          </CardContent>
        </Card>
        {/* Avisos */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4 px-5 flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-500/15">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{counts.warning}</p>
              <p className="text-xs text-muted-foreground">Avisos importantes</p>
            </div>
          </CardContent>
        </Card>
        {/* Info */}
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="py-4 px-5 flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/15">
              <Bell className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{counts.info}</p>
              <p className="text-xs text-muted-foreground">Notificações gerais</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Filtros ── */}
      <Card>
        <CardContent className="py-4 px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alertas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critical">🚨 Crítico</SelectItem>
                  <SelectItem value="warning">⚠️ Aviso</SelectItem>
                  <SelectItem value="info">🔔 Info</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-[150px]">
                  <Layers className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as tags</SelectItem>
                  {allTags.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Tabs por categoria ── */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="all" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            Todos
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {alerts.filter((a) => !a.read).length}
            </Badge>
          </TabsTrigger>
          {(Object.keys(CATEGORY_META) as AlertCategory[]).map((cat) => (
            <TabsTrigger key={cat} value={cat} className="gap-1.5">
              <span className={CATEGORY_META[cat].color}>{CATEGORY_META[cat].icon}</span>
              <span className="hidden sm:inline">{CATEGORY_META[cat].label}</span>
              {(categoryCounts[cat] || 0) > 0 && (
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                  {categoryCounts[cat]}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Single content area — filtering handled by `filtered` */}
        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <BellOff className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Nenhum alerta encontrado</p>
                <p className="text-sm">Tente alterar os filtros ou verifique o histórico.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((alert) => {
              const pm = PRIORITY_META[alert.priority];
              const cm = CATEGORY_META[alert.category];
              const isExpanded = expandedId === alert.id;

              return (
                <Card
                  key={alert.id}
                  className={`transition-all duration-200 ${
                    alert.pinned ? 'ring-2 ring-primary/30 border-primary/40' : ''
                  } ${alert.muted ? 'opacity-50' : ''} ${
                    alert.read ? 'bg-muted/30' : ''
                  } ${
                    alert.priority === 'critical' && !alert.read
                      ? 'border-red-500/40 bg-red-500/[0.03]'
                      : ''
                  }`}
                >
                  <CardContent className="py-3 px-4">
                    <div className="flex items-start gap-3">
                      {/* Dot + Icon */}
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${alert.read ? 'bg-gray-300' : pm.dot} ${
                          alert.priority === 'critical' && !alert.read ? 'animate-pulse' : ''
                        }`} />
                        <div className={cm.color}>
                          {getCategoryIcon(alert)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-semibold text-sm ${alert.read ? 'text-muted-foreground' : ''}`}>
                              {alert.pinned && <Pin className="h-3 w-3 inline mr-1 text-primary" />}
                              {alert.title}
                            </p>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${pm.badge}`}>
                              {pm.label}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {cm.label}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {timeAgo(alert.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>

                        {/* Tags */}
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {alert.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground cursor-pointer hover:bg-muted/80"
                              onClick={() => setTagFilter(tag)}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => toggleRead(alert.id)}
                          >
                            {alert.read ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                            {alert.read ? 'Não lido' : 'Lido'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => togglePin(alert.id)}
                          >
                            {alert.pinned ? <PinOff className="h-3 w-3 mr-1" /> : <Pin className="h-3 w-3 mr-1" />}
                            {alert.pinned ? 'Desafixar' : 'Fixar'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => toggleMute(alert.id)}
                          >
                            {alert.muted ? <Volume2 className="h-3 w-3 mr-1" /> : <VolumeX className="h-3 w-3 mr-1" />}
                            {alert.muted ? 'Ativar' : 'Silenciar'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </Tabs>

      {/* ── Estatísticas rápidas ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Alertas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(CATEGORY_META) as AlertCategory[]).map((cat) => {
              const total = alerts.filter((a) => a.category === cat).length;
              const unread = alerts.filter((a) => a.category === cat && !a.read).length;
              const pct = alerts.length > 0 ? (total / alerts.length) * 100 : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className={CATEGORY_META[cat].color}>{CATEGORY_META[cat].icon}</span>
                      {CATEGORY_META[cat].label}
                    </span>
                    <span className="text-muted-foreground">
                      {unread} não lidos / {total} total
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Resumo Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{alerts.length}</p>
                <p className="text-xs text-muted-foreground">Total de alertas</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{alerts.filter((a) => !a.read).length}</p>
                <p className="text-xs text-muted-foreground">Não lidos</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{alerts.filter((a) => a.pinned).length}</p>
                <p className="text-xs text-muted-foreground">Fixados</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{alerts.filter((a) => a.muted).length}</p>
                <p className="text-xs text-muted-foreground">Silenciados</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg border border-dashed text-center">
              <p className="text-xs text-muted-foreground mb-1">Prioridade dos não lidos</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {counts.critical} críticos
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {counts.warning} avisos
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  {counts.info} info
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
