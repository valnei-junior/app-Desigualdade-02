import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

export function SupportPage() {
  const [message, setMessage] = React.useState('');

  const faqs = [
    {
      question: 'Como faço para me inscrever em um curso?',
      answer: 'Acesse a página de Cursos, escolha o curso desejado e clique em "Inscrever-se em 1 clique". Você receberá uma confirmação por e-mail.',
    },
    {
      question: 'Como posso acompanhar minhas candidaturas?',
      answer: 'No Dashboard, você pode ver todas as suas candidaturas ativas. Também recebe notificações sobre atualizações.',
    },
    {
      question: 'O que é o sistema de match de competências?',
      answer: 'Comparamos suas habilidades e experiências com os requisitos da vaga para mostrar a compatibilidade em porcentagem.',
    },
    {
      question: 'Como funcionam os pontos e badges?',
      answer: 'Você ganha pontos completando cursos, candidatando-se a vagas e mantendo seu perfil atualizado. Badges são conquistas especiais.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mensagem enviada! Nossa equipe responderá em breve.');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Suporte e Ajuda</h1>
        <p className="text-muted-foreground">Encontre respostas ou entre em contato conosco</p>
      </div>

      <Tabs defaultValue="faq">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription>Respostas rápidas para dúvidas comuns</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <MessageCircle className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Chat ao Vivo</CardTitle>
                <CardDescription>Resposta imediata</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Iniciar Chat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>E-mail</CardTitle>
                <CardDescription>Resposta em até 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">suporte@carreirahub.com</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Telefone</CardTitle>
                <CardDescription>Seg-Sex, 9h-18h</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">(11) 1234-5678</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Enviar Mensagem</CardTitle>
              <CardDescription>Descreva sua dúvida ou problema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Digite sua mensagem aqui..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                />
                <Button type="submit" className="w-full">Enviar Mensagem</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tutoriais Rápidos</CardTitle>
              <CardDescription>Aprenda a usar a plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  'Como criar seu perfil profissional',
                  'Dicas para se candidatar a vagas',
                  'Como escolher o curso ideal',
                  'Navegando pela linha do tempo',
                ].map((tutorial, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                    <span>{tutorial}</span>
                    <Button variant="outline" size="sm">Assistir</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
