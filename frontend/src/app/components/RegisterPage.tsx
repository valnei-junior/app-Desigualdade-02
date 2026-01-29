import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Upload } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    area: '',
    education: '',
    resume: null as File | null,
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    (async () => {
      const success = await registerUser(
        {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          age: parseInt(formData.age),
          area: formData.area,
          education: formData.education,
          resumeUrl: formData.resume ? URL.createObjectURL(formData.resume) : undefined,
          completedCourses: [],
          appliedJobs: [],
          points: 0,
          badges: [],
        },
        formData.password || undefined
      );

      if (success) navigate('/dashboard');
      else alert('Erro ao cadastrar. Tente novamente.');
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl md:text-2xl">Cadastro</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Preencha seus dados para começar sua jornada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Nome completo</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 md:h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-9 md:h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-9 md:h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  required
                  min="16"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="h-9 md:h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area" className="text-sm">Área de interesse</Label>
                <Select
                  required
                  value={formData.area}
                  onValueChange={(value) => setFormData({ ...formData, area: value })}
                >
                  <SelectTrigger className="h-9 md:h-10 text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TI">Tecnologia da Informação</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Administração">Administração</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="education" className="text-sm">Nível de escolaridade</Label>
                <Select
                  required
                  value={formData.education}
                  onValueChange={(value) => setFormData({ ...formData, education: value })}
                >
                  <SelectTrigger className="h-9 md:h-10 text-sm">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ensino Médio Completo">Ensino Médio Completo</SelectItem>
                    <SelectItem value="Superior Incompleto">Superior Incompleto</SelectItem>
                    <SelectItem value="Superior Completo">Superior Completo</SelectItem>
                    <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="resume" className="text-sm">Currículo (opcional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
                    className="flex-1 h-9 md:h-10 text-sm file:text-sm"
                  />
                  <Upload className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: PDF, DOC, DOCX
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1 h-9 md:h-10 text-sm"
              >
                Voltar
              </Button>
              <Button type="submit" className="flex-1 h-9 md:h-10 text-sm">
                Cadastrar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}