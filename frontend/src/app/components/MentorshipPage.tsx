import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockMentors } from '@/app/data/mockData';
import { MessageCircle, Video } from 'lucide-react';
import { toast } from 'sonner';

export function MentorshipPage() {
  const handleConnect = (mentorName: string) => {
    toast.success(`Solicitação de mentoria enviada para ${mentorName}!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mentoria</h1>
        <p className="text-muted-foreground">Conecte-se com profissionais experientes para orientação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockMentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="text-5xl">{mentor.avatar}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <CardDescription>{mentor.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Área:</span>
                  <Badge variant="outline">{mentor.area}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Experiência:</span>
                  <span className="font-medium">{mentor.experience}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={mentor.available ? 'default' : 'secondary'}>
                    {mentor.available ? 'Disponível' : 'Indisponível'}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={!mentor.available}
                  onClick={() => handleConnect(mentor.name)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Conectar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!mentor.available}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Agendar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
