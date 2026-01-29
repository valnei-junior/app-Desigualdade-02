import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Download, 
  Eye, 
  ThumbsUp, 
  ThumbsDown,
  Search,
  Filter,
  Star,
  Calendar,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/app/contexts/UserContext';
import * as api from '@/app/services/api';

export function CandidatesPage() {
  const { user } = useUser();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: '',
    area: 'all',
    jobType: 'all',
    status: 'all',
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Carregar candidatos da empresa
  useEffect(() => {
    loadCandidates();
  }, [user]);

  const loadCandidates = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await api.getCompanyApplications(user.id);
      setCandidates(response.applications || []);
    } catch (error) {
      console.error('Erro ao carregar candidatos:', error);
      toast.error('Erro ao carregar candidatos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (candidate) => {
    try {
      await api.approveApplication(candidate.id);
      setCandidates(prev => 
        prev.map(c => c.id === candidate.id ? { ...c, status: 'approved' } : c)
      );
      toast.success(`${candidate.name} foi aprovado(a)!`);
    } catch (error) {
      console.error('Erro ao aprovar candidato:', error);
      toast.error('Erro ao aprovar candidato: ' + error.message);
    }
  };

  const handleReject = async (candidate) => {
    try {
      await api.rejectApplication(candidate.id);
      setCandidates(prev => 
        prev.map(c => c.id === candidate.id ? { ...c, status: 'rejected' } : c)
      );
      toast.error(`${candidate.name} foi rejeitado(a).`);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Erro ao rejeitar candidato:', error);
      toast.error('Erro ao rejeitar candidato: ' + error.message);
    }
  };

  const handleRemoveFromRejected = async (candidateId) => {
    try {
      await api.deleteApplication(candidateId);
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      toast.success('Candidato removido da lista de rejeitados.');
    } catch (error) {
      console.error('Erro ao remover candidato:', error);
      toast.error('Erro ao remover candidato: ' + error.message);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (filter.search && !candidate.name?.toLowerCase().includes(filter.search.toLowerCase()) &&
        !candidate.email?.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (filter.area !== 'all' && candidate.area !== filter.area) return false;
    if (filter.jobType !== 'all' && candidate.jobType !== filter.jobType) return false;
    if (filter.status !== 'all' && candidate.status !== filter.status) return false;
    return true;
  });

  const rejectedCandidates = candidates.filter(c => c.status === 'rejected');

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' },
      approved: { label: 'Aprovado', variant: 'default' },
      rejected: { label: 'Rejeitado', variant: 'destructive' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Candidatos</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Gerencie candidatos e visualize currículos
        </p>
      </div>

      <Tabs defaultValue="candidates" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-grid">
          <TabsTrigger value="candidates" className="text-sm">
            Candidatos ({filteredCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-sm">
            Rejeitados ({rejectedCandidates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Filter className="h-4 w-4 md:h-5 md:w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nome ou e-mail..."
                      value={filter.search}
                      onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                      className="h-9 md:h-10 text-sm pl-9"
                    />
                  </div>
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium">Tipo de Vaga</label>
                  <Select
                    value={filter.jobType}
                    onValueChange={(value) => setFilter({ ...filter, jobType: value })}
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium">Status</label>
                  <Select
                    value={filter.status}
                    onValueChange={(value) => setFilter({ ...filter, status: value })}
                  >
                    <SelectTrigger className="h-9 md:h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Candidatos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                  <p className="text-base text-muted-foreground">
                    Carregando candidatos...
                  </p>
                </CardContent>
              </Card>
            ) : filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(candidate.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base md:text-lg line-clamp-1">
                          {candidate.name}
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm">
                          {candidate.appliedFor}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(candidate.status)}
                          <Badge variant="outline" className="text-xs">{candidate.jobType}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Match */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                      <span className="text-xs md:text-sm font-medium flex items-center gap-2">
                        <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-yellow-500" />
                        Compatibilidade
                      </span>
                      <span className="text-sm md:text-base font-bold text-green-600">
                        {candidate.match}%
                      </span>
                    </div>

                    {/* Informações */}
                    <div className="space-y-2 text-xs md:text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                        <span className="truncate">{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                        <span className="truncate">{candidate.education}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                        <span>Candidatou-se em {new Date(candidate.appliedDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-xs font-medium mb-1.5">Competências:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{candidate.skills.length - 3}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {selectedCandidate && getInitials(selectedCandidate.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-lg">{selectedCandidate?.name}</div>
                                <div className="text-sm text-muted-foreground font-normal">
                                  {selectedCandidate?.appliedFor}
                                </div>
                              </div>
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                              Detalhes do candidato {selectedCandidate?.name}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedCandidate && (
                            <div className="space-y-4">
                              {/* Match */}
                              <div className="p-4 rounded-lg bg-muted">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    Compatibilidade
                                  </span>
                                  <span className="text-lg font-bold text-green-600">
                                    {selectedCandidate.match}%
                                  </span>
                                </div>
                              </div>

                              {/* Informações de Contato */}
                              <div className="space-y-3">
                                <h3 className="font-semibold">Informações de Contato</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <a href={`mailto:${selectedCandidate.email}`} className="text-blue-600 hover:underline">
                                      {selectedCandidate.email}
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedCandidate.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedCandidate.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedCandidate.age} anos</span>
                                  </div>
                                </div>
                              </div>

                              {/* Formação */}
                              <div className="space-y-2">
                                <h3 className="font-semibold">Formação</h3>
                                <div className="flex items-center gap-2 text-sm">
                                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedCandidate.education}</span>
                                </div>
                              </div>

                              {/* Competências */}
                              <div className="space-y-2">
                                <h3 className="font-semibold">Competências</h3>
                                <div className="flex flex-wrap gap-2">
                                  {selectedCandidate.skills.map((skill, idx) => (
                                    <Badge key={idx} variant="secondary">{skill}</Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Experiência */}
                              <div className="space-y-2">
                                <h3 className="font-semibold">Experiência</h3>
                                <div className="flex items-start gap-2 text-sm">
                                  <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                                  <span>{selectedCandidate.experience}</span>
                                </div>
                              </div>

                              {/* Currículo */}
                              <div className="pt-2">
                                <Button variant="outline" className="w-full" asChild>
                                  <a href={selectedCandidate.resumeUrl} download>
                                    <Download className="h-4 w-4 mr-2" />
                                    Baixar Currículo (PDF)
                                  </a>
                                </Button>
                              </div>

                              {/* Ações */}
                              <div className="flex gap-3 pt-2 border-t">
                                <Button
                                  variant="default"
                                  className="flex-1"
                                  onClick={() => handleApprove(selectedCandidate)}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Aprovar
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => handleReject(selectedCandidate)}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Rejeitar
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {candidate.status === 'pending' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleApprove(candidate)}
                          >
                            <ThumbsUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(candidate)}
                          >
                            <ThumbsDown className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-base text-muted-foreground">
                    Nenhum candidato encontrado.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Candidatos Rejeitados</CardTitle>
              <CardDescription>
                Lista de candidatos que foram rejeitados pela empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rejectedCandidates.length > 0 ? (
                <div className="space-y-3">
                  {rejectedCandidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-muted">
                            {getInitials(candidate.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.appliedFor}</p>
                          <p className="text-xs text-muted-foreground">
                            Rejeitado em {new Date(candidate.rejectedDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromRejected(candidate.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <ThumbsDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum candidato rejeitado.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}