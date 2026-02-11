import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { mockAlerts } from '@/app/data/mockData';
import { Bell, BellOff, BookOpen, Briefcase, Clock } from 'lucide-react';

export function AlertsPage() {
  const [notifications, setNotifications] = React.useState({
    courses: true,
    jobs: true,
    deadlines: true,
    email: false,
    push: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alertas e Notificações</h1>
        <p className="text-muted-foreground">Mantenha-se atualizado sobre cursos e vagas</p>
      </div>

      {/* Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificações</CardTitle>
          <CardDescription>Escolha como você quer receber alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Novos cursos
            </Label>
            <Switch
              id="courses"
              checked={notifications.courses}
              onCheckedChange={(checked) => setNotifications({ ...notifications, courses: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Novas vagas
            </Label>
            <Switch
              id="jobs"
              checked={notifications.jobs}
              onCheckedChange={(checked) => setNotifications({ ...notifications, jobs: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="deadlines" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Prazos
            </Label>
            <Switch
              id="deadlines"
              checked={notifications.deadlines}
              onCheckedChange={(checked) => setNotifications({ ...notifications, deadlines: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  alert.read ? 'bg-muted/50' : 'bg-background'
                }`}
              >
                <div className={`flex h-2 w-2 rounded-full mt-2 shrink-0 ${
                  alert.read ? 'bg-gray-300' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium">{alert.title}</p>
                    <span className="text-xs text-muted-foreground">{alert.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
