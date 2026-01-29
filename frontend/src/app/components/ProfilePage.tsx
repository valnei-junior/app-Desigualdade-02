import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import { useUser } from '@/app/contexts/UserContext';
import { ROLES } from '@/app/constants/roles';
import { User, Mail, Briefcase, GraduationCap, Upload, Building2, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    toast.success('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  // Renderização para Empresa
  if (user?.role === ROLES.COMPANY) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Perfil da Empresa</h1>
            <p className="text-muted-foreground">Gerencie as informações da sua empresa</p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            variant={isEditing ? 'default' : 'outline'}
          >
            {isEditing ? 'Salvar' : 'Editar Perfil'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={user.companyName || ''}
                  disabled={!isEditing}
                  onChange={(e) => updateUser({ companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Tamanho da Empresa</Label>
                <Input
                  id="companySize"
                  value={user.companySize || ''}
                  disabled={!isEditing}
                  onChange={(e) => updateUser({ companySize: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Responsável</Label>
                <Input
                  id="name"
                  value={user.name}
                  disabled={!isEditing}
                  onChange={(e) => updateUser({ name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled={!isEditing}
                  onChange={(e) => updateUser({ email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Setor de Atuação</Label>
                <Input
                  id="area"
                  value={user.area || ''}
                  disabled={!isEditing}
                  onChange={(e) => updateUser({ area: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Tipos de Vaga Oferecidos
            </CardTitle>
            <CardDescription>Perfis de contratação da empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.jobTypesOffered?.length > 0 ? (
                user.jobTypesOffered.map((type, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {type}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum tipo de vaga configurado</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vagas Ativas</CardTitle>
              <CardDescription>Total de vagas publicadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{user.activeJobs?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Candidatos Contratados</CardTitle>
              <CardDescription>Total de contratações realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{user.hiredCandidates?.length || 0}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderização padrão para Estudante
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? 'default' : 'outline'}
        >
          {isEditing ? 'Salvar' : 'Editar Perfil'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={user.name}
                disabled={!isEditing}
                onChange={(e) => updateUser({ name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled={!isEditing}
                onChange={(e) => updateUser({ email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                value={user.age}
                disabled={!isEditing}
                onChange={(e) => updateUser({ age: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área de Interesse</Label>
              <Input
                id="area"
                value={user.area}
                disabled={!isEditing}
                onChange={(e) => updateUser({ area: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Cursos Concluídos
          </CardTitle>
          <CardDescription>Histórico de aprendizado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {user.completedCourses?.length > 0 ? (
              user.completedCourses.map((courseId) => (
                <div key={courseId} className="flex items-center justify-between p-3 rounded-lg border">
                  <span>Desenvolvimento Web Full Stack</span>
                  <Badge variant="secondary">Concluído</Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Nenhum curso concluído ainda</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Vagas Aplicadas
          </CardTitle>
          <CardDescription>Status das candidaturas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {user.appliedJobs?.length > 0 ? (
              user.appliedJobs.map((jobId) => (
                <div key={jobId} className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Desenvolvedor Frontend Júnior</span>
                    <Badge>Em análise</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">TechCorp • Enviado em 10/01/2026</p>
                  <div className="p-3 bg-muted rounded text-sm">
                    <p className="font-medium mb-1">Feedback da empresa:</p>
                    <p className="text-muted-foreground">
                      Seu perfil está sendo analisado. Retornaremos em até 5 dias úteis.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Nenhuma candidatura enviada ainda</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Currículo
          </CardTitle>
          <CardDescription>Upload e gerenciamento do seu currículo</CardDescription>
        </CardHeader>
        <CardContent>
          {user.resumeUrl ? (
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">curriculo.pdf</p>
                <p className="text-sm text-muted-foreground">Enviado</p>
              </div>
              <Button variant="outline" size="sm">
                Atualizar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">Nenhum currículo enviado</p>
              <Button>Enviar Currículo</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}