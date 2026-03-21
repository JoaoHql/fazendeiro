import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Página de Login
 * Design: Minimalismo Corporativo Moderno
 * - Card branco centralizado com sombra suave
 * - Campos com bordas que ficam verdes no focus
 * - Botão "Entrar" em verde sólido
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
      toast.success('Login realizado com sucesso!');
      setLocation('/');
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
      console.error('Erro de login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-card rounded-lg shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Sistema de Pedidos
            </h1>
            <p className="text-muted-foreground text-sm">
              Faça login para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className="border-border focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="border-border focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Botão Entrar */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground text-xs">
            Use credenciais de teste para acessar
          </p>
        </div>
      </div>
    </div>
  );
}
