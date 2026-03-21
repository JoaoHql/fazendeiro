import { useState } from 'react';
import { useLocation } from 'wouter';
import { Leaf, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(phone, password);
      const isAdmin = phone.trim().toLowerCase() === 'admin';
      toast.success('Acesso concedido');
      setLocation(isAdmin ? '/admin' : '/');
    } catch (error) {
      toast.error('Credenciais invalidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0d09] px-4">
      <div className="absolute right-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="z-10 w-full max-w-md">
        <div className="glass relative overflow-hidden rounded-[2.5rem] border-white/5 p-10 shadow-2xl">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="mb-10 space-y-4 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-foreground">
              FAZENDEIRO <span className="text-primary not-italic">MARKET</span>
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Portal de Reservas Premium
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
              >
                Telefone ou ID
              </Label>
              <Input
                id="phone"
                placeholder="cliente ou admin"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className="h-14 rounded-2xl border-white/10 bg-white/5 text-foreground placeholder:text-white/10 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
              >
                Senha de Acesso
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-14 rounded-2xl border-white/10 bg-white/5 text-foreground placeholder:text-white/10 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="group h-14 w-full rounded-2xl bg-primary font-black uppercase tracking-widest text-primary-foreground shadow-xl transition-all hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Acessar Sistema
                  <ShieldCheck className="h-4 w-4 transition-transform group-hover:rotate-12" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 grid gap-3 rounded-2xl border border-white/5 bg-background/40 p-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <p>Cliente demo: `cliente` / `123456`</p>
            <p>Admin demo: `admin` / `admin123`</p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-white/20">
          Fazendeiro System v2.0 © 2026
        </p>
      </div>
    </div>
  );
}
