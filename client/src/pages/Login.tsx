import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Leaf, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Página de Login - Premium Farm Edition
 */
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
      toast.success('Acesso concedido');
      setLocation('/');
    } catch (error) {
      toast.error('Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d09] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-md z-10">
        {/* Login Card */}
        <div className="glass rounded-[2.5rem] p-10 shadow-2xl border-white/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
           
          {/* Brand Header */}
          <div className="text-center space-y-4 mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
               <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground italic">
              FAZENDEIRO <span className="text-primary not-italic">MARKET</span>
            </h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em]">
              Portal de Reservas Premium
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Telefone ou ID
              </Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Senha de Acesso
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-white/10"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Acessar Mercado <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer Branding */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
             <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-[0.2em]">
               Exclusivo para produtores & parceiros selecionados
             </p>
          </div>
        </div>
        
        {/* Support Info */}
        <p className="text-center mt-8 text-[10px] text-white/20 uppercase tracking-widest font-bold">
          Fazendeiro System v2.0 &copy; 2026
        </p>
      </div>
    </div>
  );
}
