import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useUser } from '@/app/contexts/UserContext';
import { Award, Trophy, Star, Zap } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';

export function GamificationPage() {
  const { user } = useUser();

  const badges = [
    { id: 'first-course', name: 'Primeiro Curso', icon: '📚', unlocked: true },
    { id: 'first-application', name: 'Primeira Candidatura', icon: '💼', unlocked: true },
    { id: 'profile-complete', name: 'Perfil Completo', icon: '✨', unlocked: false },
    { id: 'five-courses', name: '5 Cursos Concluídos', icon: '🎓', unlocked: false },
  ];

  const achievements = [
    { name: 'Inscrição em curso', points: 50, description: 'Complete um curso' },
    { name: 'Candidatura enviada', points: 30, description: 'Candidate-se a uma vaga' },
    { name: 'Perfil atualizado', points: 20, description: 'Mantenha seu perfil atualizado' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gamificação</h1>
        <p className="text-muted-foreground">Acompanhe suas conquistas e ganhe pontos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Pontos Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{user?.points || 0}</p>
            <Progress value={((user?.points || 0) / 500) * 100} className="mt-4" />
            <p className="text-xs text-muted-foreground mt-2">
              {500 - (user?.points || 0)} pontos para o próximo nível
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{user?.badges?.length || 0}/{badges.length}</p>
            <p className="text-sm text-muted-foreground mt-2">Badges conquistados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">#47</p>
            <p className="text-sm text-muted-foreground mt-2">Sua posição no ranking</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seus Badges</CardTitle>
          <CardDescription>Conquiste badges completando atividades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center p-4 rounded-lg border ${
                  badge.unlocked ? 'bg-background' : 'bg-muted opacity-50'
                }`}
              >
                <span className="text-4xl mb-2">{badge.icon}</span>
                <p className="text-sm font-medium text-center">{badge.name}</p>
                {badge.unlocked && (
                  <Badge variant="secondary" className="mt-2">Desbloqueado</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Como Ganhar Pontos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{achievement.name}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <Badge variant="outline">+{achievement.points} pts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
