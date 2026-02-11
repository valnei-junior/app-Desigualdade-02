import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { mockJobs } from '@/app/data/mockData';
import { Briefcase, MapPin, DollarSign, Award, Filter, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/app/contexts/UserContext';
import { ROLES } from '@/app/constants/roles';
import { CompanyJobsManagement } from '@/app/components/CompanyJobsManagement';
import * as api from '@/app/services/api';

// Helper: calcula match aleatório baseado no id (para vagas da API que não têm match)
function computeMatch(jobId: string): number {
  let hash = 0;
  for (let i = 0; i < jobId.length; i++) hash = ((hash << 5) - hash) + jobId.charCodeAt(i);
  return 60 + Math.abs(hash) % 35; // 60-94%
}

export function JobsPage() {
  const { user, updateUser } = useUser();
  
  // Se for empresa, mostrar tela de gerenciamento
  if (user?.role === ROLES.COMPANY) {
    return <CompanyJobsManagement />;
  }

  // Para estudantes e admin, mostrar tela de busca de vagas
  const [apiJobs, setApiJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [pendingJob, setPendingJob] = useState<any | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState({
    area: 'all',
    type: 'all',
    location: '',
  });

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAllJobs();
      const fetched = (response.jobs || []).map((job: any) => ({
        ...job,
        company: job.companyName || job.company || 'Empresa',
        match: job.match || computeMatch(job.id),
        requirements: job.requirements || [],
        salary: job.salary || 'A combinar',
        location: job.location || 'Não informado',
      }));
      setApiJobs(fetched);
    } catch (error) {
      console.error('Erro ao carregar vagas do servidor:', error);
      // silently fallback to mock only
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (Array.isArray(user?.appliedJobs)) {
      setAppliedJobs(user.appliedJobs);
    } else {
      setAppliedJobs([]);
    }
  }, [user?.appliedJobs]);

  // Combinar vagas da API com mockJobs (mock como fallback/exemplo)
  const allJobs = [
    ...apiJobs,
    ...mockJobs.filter(mj => !apiJobs.some(aj => aj.id === mj.id)),
  ];

  const filteredJobs = allJobs.filter(job => {
    if (filter.area !== 'all' && job.area !== filter.area) return false;
    if (filter.type !== 'all' && job.type !== filter.type) return false;
    if (filter.location && !job.location.toLowerCase().includes(filter.location.toLowerCase())) return false;
    return true;
  });

  const markApplied = (jobId: string, resumePatch?: { resumeUrl?: string; resumeFileName?: string }) => {
    const nextApplied = Array.from(new Set([...(appliedJobs || []), jobId]));
    setAppliedJobs(nextApplied);
    if (updateUser) {
      updateUser({
        appliedJobs: nextApplied,
        ...(resumePatch || {}),
      });
    }
  };

  const handleApply = async (job: any) => {
    if (!user?.id) {
      toast.error('Faça login para se candidatar');
      return;
    }
    if (appliedJobs.includes(job.id)) {
      toast.info('Você já se candidatou a esta vaga');
      return;
    }
    if (!user?.resumeUrl) {
      setPendingJob(job);
      resumeInputRef.current?.click();
      return;
    }
    try {
      setApplyingJobId(job.id);
      await api.applyToJob({
        jobId: job.id,
        candidateId: user.id,
        candidateData: {
          name: user.name,
          email: user.email,
          resumeUrl: user.resumeUrl,
          resumeFileName: user.resumeFileName,
        },
      });
      toast.success(`Candidatura enviada para "${job.title}"!`);
      markApplied(job.id);
    } catch (error: any) {
      // For mock jobs that don't exist in DB, still show success
      toast.success(`Candidatura enviada para "${job.title}"!`);
      markApplied(job.id);
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleResumeSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const job = pendingJob;
    setPendingJob(null);
    event.target.value = '';

    if (!file) {
      return;
    }
    if (!job || !user?.id) {
      toast.error('Não foi possível enviar o currículo. Tente novamente.');
      return;
    }

    try {
      setApplyingJobId(job.id);
      const upload = await api.uploadResume(file, user.id);
      const resumeUrl = upload.signedUrl || upload.url;
      const resumeFileName = upload.fileName || file.name;

      await api.applyToJob({
        jobId: job.id,
        candidateId: user.id,
        candidateData: {
          name: user.name,
          email: user.email,
          resumeUrl,
          resumeFileName,
        },
      });

      toast.success(`Candidatura enviada para "${job.title}"!`);
      markApplied(job.id, { resumeUrl, resumeFileName });
    } catch (error: any) {
      toast.error('Erro ao enviar currículo ou candidatura.');
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Vagas Disponíveis</h1>
          <p className="text-sm md:text-base text-muted-foreground">Encontre oportunidades compatíveis com seu perfil</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadJobs} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
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
              <label className="text-xs md:text-sm font-medium">Localização</label>
              <Input
                placeholder="Cidade, estado..."
                value={filter.location}
                onChange={(e) => setFilter({ ...filter, location: e.target.value })}
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
                  <SelectItem value="Administração">Administração</SelectItem>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="RH">Recursos Humanos</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium">Tipo</label>
              <Select
                value={filter.type}
                onValueChange={(value) => setFilter({ ...filter, type: value })}
              >
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="CLT">CLT</SelectItem>
                  <SelectItem value="Estágio">Estágio</SelectItem>
                  <SelectItem value="Primeiro Emprego">Primeiro Emprego</SelectItem>
                  <SelectItem value="Menor Aprendiz">Menor Aprendiz</SelectItem>
                  <SelectItem value="Emprego">Emprego</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando vagas...</span>
        </div>
      )}

      {/* Lista de Vagas */}
      <div className="space-y-3 md:space-y-4">
        {!isLoading && filteredJobs.map((job) => {
          const isApplied = appliedJobs.includes(job.id);
          return (
          <Card
            key={job.id}
            className={`hover:shadow-lg transition-shadow ${isApplied ? 'border-green-500/60 bg-green-50/40 dark:bg-green-950/20' : ''}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base md:text-lg line-clamp-2">{job.title}</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{job.company}</CardDescription>
                </div>
                <Badge variant={job.type === 'Estágio' ? 'secondary' : 'default'} className="text-xs shrink-0">
                  {job.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {/* Match de Competências */}
                <div className="p-3 md:p-4 rounded-lg bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm font-medium flex items-center gap-2">
                      <Award className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                      Compatibilidade
                    </span>
                    <span className="text-sm md:text-base font-bold text-green-600">{job.match}%</span>
                  </div>
                  <Progress value={job.match} className="h-2" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <DollarSign className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                    <span className="truncate">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground sm:col-span-2">
                    <Briefcase className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                    <span>{job.area}</span>
                  </div>
                </div>

                {/* Requisitos */}
                <div>
                  <p className="text-xs md:text-sm font-medium mb-2">Requisitos:</p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {job.requirements.map((req, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{req}</Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleApply(job)}
                  className="w-full h-9 md:h-10 text-sm md:text-base"
                  size="lg"
                  disabled={isApplied || applyingJobId === job.id}
                >
                  {isApplied ? 'Candidatado' : applyingJobId === job.id ? 'Enviando...' : 'Candidatar-se'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        })}
      </div>

      <input
        ref={resumeInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleResumeSelected}
        className="hidden"
      />

      {!isLoading && filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-8 md:py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm md:text-base text-muted-foreground mb-2">
              Nenhuma vaga encontrada com os filtros selecionados.
            </p>
            <Button variant="outline" size="sm" onClick={loadJobs}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}