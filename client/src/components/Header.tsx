import { ShoppingCart, History, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

interface HeaderProps {
  onCartClick: () => void;
  onOrdersClick: () => void;
  onProfileClick: () => void;
}

/**
 * Header Fixo no Topo
 * Design: Minimalismo Corporativo Moderno
 * - Fundo branco com borda inferior sutil
 * - Ícones em cinza escuro, mudam para verde no hover
 * - Badge verde com quantidade de itens
 */
export default function Header({
  onCartClick,
  onOrdersClick,
  onProfileClick,
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
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Título */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">
              Pedidos
            </h1>
          </div>

          {/* Ícones de Ação */}
          <div className="flex items-center gap-6">
            {/* Catálogo */}
            {!isOnCatalog && (
              <button
                onClick={() => setLocation('/')}
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors duration-200 rounded-lg hover:bg-secondary"
                title="Catálogo"
              >
                <ShoppingCart className="w-6 h-6" />
              </button>
            )}

            {/* Carrinho */}
            {isOnCatalog && (
              <button
                onClick={onCartClick}
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors duration-200 rounded-lg hover:bg-secondary"
                title="Carrinho"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Meus Pedidos */}
            <button
              onClick={() => {
                setLocation('/pedidos');
                onOrdersClick();
              }}
              className={`relative p-2 transition-colors duration-200 rounded-lg ${
                isOnOrders
                  ? 'text-primary bg-accent'
                  : 'text-muted-foreground hover:text-primary hover:bg-secondary'
              }`}
              title="Meus Pedidos"
            >
              <History className="w-6 h-6" />
            </button>

            {/* Perfil/Logout */}
            <button
              onClick={handleLogout}
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors duration-200 rounded-lg hover:bg-secondary"
              title="Sair"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
