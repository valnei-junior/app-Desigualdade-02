import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { mockCourses } from '@/app/data/mockData';
import { BookOpen, Calendar, Clock, Users, Filter } from 'lucide-react';
import { toast } from 'sonner';

export function CoursesPage() {
  const [filter, setFilter] = useState({
    area: 'all',
    free: 'all',
    search: '',
  });

  const filteredCourses = mockCourses.filter(course => {
    if (filter.area !== 'all' && course.area !== filter.area) return false;
    if (filter.free === 'free' && !course.free) return false;
    if (filter.free === 'paid' && course.free) return false;
    if (filter.search && !course.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleEnroll = (courseTitle: string) => {
    toast.success(`Inscrição realizada em "${courseTitle}"!`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Cursos Disponíveis</h1>
        <p className="text-sm md:text-base text-muted-foreground">Aprenda novas habilidades e impulsione sua carreira</p>
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
              <label className="text-xs md:text-sm font-medium">Buscar</label>
              <Input
                placeholder="Nome do curso..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
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
                value={filter.free}
                onValueChange={(value) => setFilter({ ...filter, free: value })}
              >
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="free">Gratuitos</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base md:text-lg line-clamp-2">{course.title}</CardTitle>
                {course.free && (
                  <Badge variant="secondary" className="text-xs shrink-0">Gratuito</Badge>
                )}
              </div>
              <CardDescription className="text-xs md:text-sm line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <BookOpen className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <span>{course.area}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <span>Início: {course.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <span>Duração: {course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                  <Users className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <span>{course.spots} vagas</span>
                </div>

                <Button
                  onClick={() => handleEnroll(course.title)}
                  className="w-full mt-3 md:mt-4 h-9 md:h-10 text-sm"
                >
                  Inscrever-se em 1 clique
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="py-8 md:py-12 text-center">
            <p className="text-sm md:text-base text-muted-foreground">
              Nenhum curso encontrado com os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}