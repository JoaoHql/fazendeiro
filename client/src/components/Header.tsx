import { History, LayoutDashboard, LogOut, ShoppingCart } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onCartClick: () => void;
  onOrdersClick: () => void;
  onProfileClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const { getCartCount } = useCart();
  const { logout, user } = useAuth();
  const [location, setLocation] = useLocation();

  const cartCount = getCartCount();
  const isOnCatalog = location === '/';
  const isOnOrders = location === '/pedidos';
  const isOnAdmin = location === '/admin';
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-4">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/5 px-6 shadow-2xl glass">
        <div
          className="group flex cursor-pointer items-center"
          onClick={() => setLocation(isAdmin ? '/admin' : '/')}
        >
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform duration-300 group-hover:rotate-6">
            <span className="text-xl font-black text-primary-foreground">F</span>
          </div>
          <div>
            <h1 className="hidden bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:block">
              FAZENDEIRO
              <span className="ml-1 text-sm font-light tracking-[0.2em] text-foreground/40">
                {isAdmin ? ' OPS' : ' MARKET'}
              </span>
            </h1>
            <p className="hidden text-[9px] font-bold uppercase tracking-[0.3em] text-primary/50 sm:block">
              {isAdmin ? 'Painel Administrativo' : 'Portal do Cliente'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isAdmin && (
            <>
              <button
                onClick={isOnCatalog ? onCartClick : () => setLocation('/')}
                className={cn(
                  'group relative rounded-xl p-3 transition-all duration-300',
                  isOnCatalog && cartCount > 0
                    ? 'border border-primary/20 bg-primary/10 text-primary'
                    : 'text-foreground/60 hover:bg-white/5 hover:text-primary'
                )}
                title={isOnCatalog ? 'Meu Carrinho' : 'Voltar ao Catalogo'}
              >
                <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-black text-primary-foreground shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setLocation('/pedidos')}
                className={cn(
                  'group relative rounded-xl p-3 transition-all duration-300',
                  isOnOrders
                    ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'text-foreground/60 hover:bg-white/5 hover:text-primary'
                )}
                title="Meus Pedidos"
              >
                <History className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </button>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => setLocation('/admin')}
              className={cn(
                'group rounded-xl p-3 transition-all duration-300',
                isOnAdmin
                  ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'text-foreground/60 hover:bg-white/5 hover:text-primary'
              )}
              title="Painel Admin"
            >
              <LayoutDashboard className="h-5 w-5 transition-transform group-hover:scale-110" />
            </button>
          )}

          {!isAdmin && (
            <button
              onClick={() => setLocation('/admin')}
              className="group rounded-xl p-3 text-foreground/60 transition-all duration-300 hover:bg-white/5 hover:text-primary"
              title="Area Admin"
            >
              <LayoutDashboard className="h-5 w-5 transition-transform group-hover:scale-110" />
            </button>
          )}

          <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />

          <button
            onClick={handleLogout}
            className="group rounded-xl p-3 text-foreground/40 transition-all duration-300 hover:bg-destructive/5 hover:text-destructive"
            title="Sair da Conta"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </header>
  );
}
