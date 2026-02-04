import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useUser } from '@/app/contexts/UserContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      const ok = await loginWithCredentials(email, password);
      if (ok) {
        navigate('/dashboard');
      } else {
        setError('Credenciais inválidas.');
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
            <div>
              <CardTitle className="text-xl">Entrar</CardTitle>
              <CardDescription className="text-sm">Use seu e-mail e senha para entrar</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Entrar</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/cadastro')}>Cadastrar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
