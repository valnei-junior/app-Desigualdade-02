import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { requestPasswordReset } from '@/app/services/api';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const ok = await requestPasswordReset(email);
    setLoading(false);

    if (ok) {
      setMessage('Se o e-mail existir, você receberá instruções para redefinir sua senha.');
    } else {
      setError('Não foi possível enviar o e-mail. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Esqueci minha senha</CardTitle>
          <CardDescription>Informe o e-mail cadastrado e enviaremos instruções.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fp-email">E-mail</Label>
              <Input id="fp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Enviando...' : 'Enviar instruções'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/login')}>Voltar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
