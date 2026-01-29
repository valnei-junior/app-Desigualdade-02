import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Checkbox } from '@/app/components/ui/checkbox';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  MapPin, 
  DollarSign, 
  Briefcase,
  Users,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/app/contexts/UserContext';
import * as api from '@/app/services/api';

// Mover o JobForm para fora do componente principal
function JobForm({ formData, setFormData, isEdit, onCancel, onSave }) {
  const addRequirement = () => {
    if (formData.newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, formData.newRequirement.trim()],
        newRequirement: '',
      });
    }
  };

  const removeRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Vaga *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Desenvolvedor Frontend Jr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva as responsabilidades e atividades da vaga..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="area">Área *</Label>
          <Select
            value={formData.area}
            onValueChange={(value) => setFormData({ ...formData, area: value })}
          >
            <SelectTrigger id="area">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TI">Tecnologia da Informação</SelectItem>
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
          <Label htmlFor="type">Tipo de Vaga *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLT">CLT</SelectItem>
              <SelectItem value="Estágio">Estágio</SelectItem>
              <SelectItem value="Primeiro Emprego">Primeiro Emprego</SelectItem>
              <SelectItem value="Menor Aprendiz">Menor Aprendiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Ex: São Paulo, SP"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salário/Bolsa</Label>
          <Input
            id="salary"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="Ex: R$ 3.000 - R$ 4.500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Requisitos/Competências</Label>
        <div className="flex gap-2">
          <Input
            value={formData.newRequirement}
            onChange={(e) => setFormData({ ...formData, newRequirement: e.target.value })}
            placeholder="Ex: React"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
          />
          <Button type="button" onClick={addRequirement} variant="outline">
            Adicionar
          </Button>
        </div>
        {formData.requirements.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.requirements.map((req, idx) => (
              <Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors" onClick={() => removeRequirement(idx)}>
                {req} ✕
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="button" onClick={onSave}>
          {isEdit ? 'Salvar Alterações' : 'Criar Vaga'}
        </Button>
      </div>
    </div>
  );
}

export function CompanyJobsManagement() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: '',
    type: '',
    location: '',
    salary: '',
    requirements: [],
    newRequirement: '',
  });

  // Carregar vagas da empresa
  useEffect(() => {
    loadJobs();
  }, [user]);

  const loadJobs = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await api.getCompanyJobs(user.id);
      setJobs(response.jobs || []);
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      toast.error('Erro ao carregar vagas: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      area: '',
      type: '',
      location: '',
      salary: '',
      requirements: [],
      newRequirement: '',
    });
  };

  const handleCreateJob = async () => {
    if (!formData.title || !formData.area || !formData.type) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const jobData = {
        companyId: user.id,
        title: formData.title,
        description: formData.description,
        area: formData.area,
        type: formData.type,
        location: formData.location,
        salary: formData.salary,
        requirements: formData.requirements,
      };

      const response = await api.createJob(jobData);
      
      if (response.success) {
        setJobs([response.job, ...jobs]);
        toast.success('Vaga criada com sucesso!');
        setIsCreateDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      toast.error('Erro ao criar vaga: ' + error.message);
    }
  };

  const handleEditJob = async () => {
    if (!formData.title || !formData.area || !formData.type) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        area: formData.area,
        type: formData.type,
        location: formData.location,
        salary: formData.salary,
        requirements: formData.requirements,
        active: selectedJob.active,
        applicants: selectedJob.applicants,
      };

      const response = await api.updateJob(selectedJob.id, jobData);
      
      if (response.success) {
        setJobs(jobs.map(job => 
          job.id === selectedJob.id ? response.job : job
        ));
        toast.success('Vaga atualizada com sucesso!');
        setIsEditDialogOpen(false);
        setSelectedJob(null);
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao atualizar vaga:', error);
      toast.error('Erro ao atualizar vaga: ' + error.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Tem certeza que deseja excluir esta vaga?')) {
      return;
    }

    try {
      const response = await api.deleteJob(jobId);
      
      if (response.success) {
        setJobs(jobs.filter(job => job.id !== jobId));
        toast.success('Vaga excluída com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao deletar vaga:', error);
      toast.error('Erro ao deletar vaga: ' + error.message);
    }
  };

  const handleToggleActive = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    try {
      const updatedData = { ...job, active: !job.active };
      const response = await api.updateJob(jobId, updatedData);
      
      if (response.success) {
        setJobs(jobs.map(j => j.id === jobId ? response.job : j));
        toast.success(job.active ? 'Vaga desativada' : 'Vaga ativada');
      }
    } catch (error) {
      console.error('Erro ao atualizar status da vaga:', error);
      toast.error('Erro ao atualizar vaga: ' + error.message);
    }
  };

  const openEditDialog = (job) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      area: job.area,
      type: job.type,
      location: job.location,
      salary: job.salary,
      requirements: job.requirements,
      newRequirement: '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gerenciar Vagas</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Crie e gerencie as vagas da sua empresa
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Vaga
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Vaga</DialogTitle>
              <DialogDescription>
                Preencha os dados da vaga que deseja criar
              </DialogDescription>
            </DialogHeader>
            <JobForm
              formData={formData}
              setFormData={setFormData}
              isEdit={false}
              onCancel={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
              onSave={handleCreateJob}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total de Vagas</CardDescription>
            <CardTitle className="text-2xl">{jobs.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Vagas Ativas</CardDescription>
            <CardTitle className="text-2xl">{jobs.filter(j => j.active).length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total de Candidaturas</CardDescription>
            <CardTitle className="text-2xl">
              {jobs.reduce((sum, job) => sum + job.applicants, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Lista de Vagas */}
      <div className="space-y-3 md:space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
              <p className="text-base text-muted-foreground mb-4">
                Carregando vagas...
              </p>
            </CardContent>
          </Card>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className={`${!job.active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base md:text-lg line-clamp-1">
                        {job.title}
                      </CardTitle>
                      {!job.active && <Badge variant="secondary">Inativa</Badge>}
                    </div>
                    <CardDescription className="text-xs md:text-sm">
                      Criada em {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  <Badge variant={job.type === 'Estágio' ? 'secondary' : 'default'} className="text-xs shrink-0">
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs md:text-sm">
                  {job.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                      <span className="truncate">{job.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                    <span>{job.area}</span>
                  </div>
                </div>

                {job.requirements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1.5">Requisitos:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requirements.map((req, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{req}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{job.applicants} candidato{job.applicants !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleToggleActive(job.id)}
                  >
                    {job.active ? (
                      <>
                        <EyeOff className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Ativar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => openEditDialog(job)}
                  >
                    <Pencil className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-base text-muted-foreground mb-4">
                Nenhuma vaga criada ainda.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Vaga
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Vaga</DialogTitle>
            <DialogDescription>
              Atualize as informações da vaga
            </DialogDescription>
          </DialogHeader>
          <JobForm
            formData={formData}
            setFormData={setFormData}
            isEdit={true}
            onCancel={() => {
              setIsEditDialogOpen(false);
              resetForm();
            }}
            onSave={handleEditJob}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}