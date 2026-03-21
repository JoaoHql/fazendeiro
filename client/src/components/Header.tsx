import { ShoppingCart, History, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onCartClick: () => void;
  onOrdersClick: () => void;
  onProfileClick: () => void;
}

/**
 * Header Fixo no Topo - Premium Farm Edition
 * Design: Organic Dark / Gold
 * - Backdrop blur glass effect
 * - Gold gradient logo
 * - Floating appearance
 */
export default function Header({
  onCartClick,
  onOrdersClick,
}: HeaderProps) {
  const { getCartCount } = useCart();
  const { logout } = useAuth();
  const [location, setLocation] = useLocation();

  const cartCount = getCartCount();
  const isOnCatalog = location === '/';
  const isOnOrders = location === '/pedidos';

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-4">
      <div className="max-w-7xl mx-auto h-16 rounded-2xl glass flex items-center justify-between px-6 shadow-2xl border-white/5">
        {/* Logo / Brand */}
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => setLocation('/')}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 group-hover:rotate-6 transition-transform duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <span className="text-primary-foreground font-black text-xl">F</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden sm:block">
            FAZENDEIRO <span className="font-light text-foreground/40 text-sm tracking-[0.2em] ml-1">MARKET</span>
          </h1>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {/* Catalog / Cart Logic */}
          <button
            onClick={isOnCatalog ? onCartClick : () => setLocation('/')}
            className={cn(
              "relative p-3 rounded-xl transition-all duration-300 group",
              isOnCatalog && cartCount > 0 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-foreground/60 hover:text-primary hover:bg-white/5"
            )}
            title={isOnCatalog ? "Meu Carrinho" : "Voltar ao Catálogo"}
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-background shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {/* My Orders History */}
          <button
            onClick={() => setLocation('/pedidos')}
            className={cn(
              "relative p-3 rounded-xl transition-all duration-300 group",
              isOnOrders 
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                : "text-foreground/60 hover:text-primary hover:bg-white/5"
            )}
            title="Meus Pedidos"
          >
            <History className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-3 text-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all duration-300 group"
            title="Sair da Conta"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
