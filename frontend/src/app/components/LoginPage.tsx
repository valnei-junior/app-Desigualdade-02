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
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Decorative sponsor images (absolute, don't affect layout).
          Place your images in `frontend/public/sponsors/` with these names:
          sponsor1.png ... sponsor6.png
      */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img src="/sponsors/sponsor1.png" alt="" className="absolute -left-8 top-20 h-12 opacity-80 filter grayscale transition-transform" />
        <img src="/sponsors/sponsor2.png" alt="" className="absolute right-6 -top-6 h-10 opacity-80 filter grayscale transition-transform" />
        <img src="/sponsors/sponsor3.png" alt="" className="absolute left-4 bottom-10 h-14 opacity-80 filter grayscale transition-transform" />
        <img src="/sponsors/sponsor4.png" alt="" className="absolute -right-10 bottom-20 h-12 opacity-80 filter grayscale transition-transform" />
        <img src="/sponsors/sponsor5.png" alt="" className="absolute left-1/2 -translate-x-1/2 top-6 h-10 opacity-80 filter grayscale transition-transform" />
        <img src="/sponsors/sponsor6.png" alt="" className="absolute left-6 top-1/2 -translate-y-1/2 h-10 opacity-80 filter grayscale transition-transform" />
      </div>

      <Card className="w-full max-w-md relative z-10">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 flex items-center gap-2 px-2 py-1"
          aria-label="Voltar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-gray-600" aria-hidden>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm hover:text-blue-600">Voltar</span>
        </Button>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Entrar</CardTitle>
          <CardDescription className="text-sm">Use seu e-mail e senha para entrar</CardDescription>
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
      {/* Patrocinadores (estático) */}
      <div className="w-full max-w-md mt-6 flex items-center justify-center">
        <div className="flex items-center justify-center gap-4 bg-white/50 rounded-md px-4 py-2 shadow-sm">
          <img src="https://via.placeholder.com/120x40?text=Patrocinador+1" alt="Patrocinador 1" className="h-10 object-contain filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition" />
          <img src="https://via.placeholder.com/120x40?text=Patrocinador+2" alt="Patrocinador 2" className="h-10 object-contain filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition" />
          <img src="https://via.placeholder.com/120x40?text=Patrocinador+3" alt="Patrocinador 3" className="h-10 object-contain filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition" />
          <img src="https://via.placeholder.com/120x40?text=Patrocinador+4" alt="Patrocinador 4" className="h-10 object-contain filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition" />
        </div>
      </div>
    </div>
  );
}
