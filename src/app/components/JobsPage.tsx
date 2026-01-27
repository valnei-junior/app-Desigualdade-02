import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { mockJobs } from '@/app/data/mockData';
import { Briefcase, MapPin, DollarSign, Award, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/app/contexts/UserContext';
import { ROLES } from '@/app/constants/roles';
import { CompanyJobsManagement } from '@/app/components/CompanyJobsManagement';

export function JobsPage() {
  const { user } = useUser();
  
  // Se for empresa, mostrar tela de gerenciamento
  if (user?.role === ROLES.COMPANY) {
    return <CompanyJobsManagement />;
  }

  // Para estudantes, mostrar tela de busca de vagas
  const [filter, setFilter] = useState({
    area: 'all',
    type: 'all',
    location: '',
  });

  const filteredJobs = mockJobs.filter(job => {
    if (filter.area !== 'all' && job.area !== filter.area) return false;
    if (filter.type !== 'all' && job.type !== filter.type) return false;
    if (filter.location && !job.location.toLowerCase().includes(filter.location.toLowerCase())) return false;
    return true;
  });

  const handleApply = (jobTitle: string) => {
    toast.success(`Candidatura enviada para "${jobTitle}"!`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Vagas Disponíveis</h1>
        <p className="text-sm md:text-base text-muted-foreground">Encontre oportunidades compatíveis com seu perfil</p>
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
                  <SelectItem value="Estágio">Estágio</SelectItem>
                  <SelectItem value="Emprego">Emprego</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vagas */}
      <div className="space-y-3 md:space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
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
                  onClick={() => handleApply(job.title)}
                  className="w-full h-9 md:h-10 text-sm md:text-base"
                  size="lg"
                >
                  Candidatar-se
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-8 md:py-12 text-center">
            <p className="text-sm md:text-base text-muted-foreground">
              Nenhuma vaga encontrada com os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}