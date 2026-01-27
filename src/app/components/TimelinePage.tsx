import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { mockTimeline } from '@/app/data/mockData';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export function TimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Linha do Tempo</h1>
        <p className="text-muted-foreground">Visualize sua jornada de desenvolvimento profissional</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sua Jornada: Curso → Estágio → Emprego</CardTitle>
          <CardDescription>Acompanhe seu progresso e metas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {mockTimeline.map((item, index) => (
              <div key={item.id} className="relative">
                {index !== mockTimeline.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-muted" />
                )}
                <div className="flex gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full shrink-0 ${
                    item.status === 'completed' ? 'bg-green-100 text-green-600' :
                    item.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {item.status === 'completed' ? <CheckCircle2 className="h-6 w-6" /> :
                     item.status === 'in-progress' ? <Clock className="h-6 w-6" /> :
                     <Circle className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{item.stage}: {item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <Badge variant={
                        item.status === 'completed' ? 'default' :
                        item.status === 'in-progress' ? 'secondary' :
                        'outline'
                      }>
                        {item.status === 'completed' ? 'Concluído' :
                         item.status === 'in-progress' ? 'Em andamento' :
                         'Pendente'}
                      </Badge>
                    </div>
                    <Progress value={item.progress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">{item.progress}% completo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
