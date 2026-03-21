import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  tipo_incremento: number; 
  isBundle?: boolean; 
  pixKey?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cartItems, addToCart, updateCartItem } = useCart();
  
  // Fonte única da verdade: Carrinho
  const cartItem = cartItems.find(item => item.productId === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;

  const handleIncrement = () => {
    if (currentQty === 0) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: product.tipo_incremento,
        incrementType: product.tipo_incremento,
        pixKey: product.pixKey,
      });
    } else {
      updateCartItem(product.id, currentQty + product.tipo_incremento);
    }
  };

  const handleDecrement = () => {
    if (currentQty > 0) {
      updateCartItem(product.id, Math.max(0, currentQty - product.tipo_incremento));
    }
  };

  // Cálculo garantido
  const totalValue = (product.price * currentQty).toFixed(2);

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {product.description}
              </p>
            )}
          </div>
          <div className="p-2 bg-secondary rounded-lg">
             <ShoppingBag className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-2xl font-black text-primary">
              R$ {product.price.toFixed(2)}
            </p>
            {currentQty > 0 && (
              <p className="text-[10px] font-black text-primary/60 tracking-widest uppercase mt-1 animate-in fade-in slide-in-from-left-2">
                SUBTOTAL ( {currentQty} X ): R$ {totalValue}
              </p>
            )}
          </div>

          {product.isBundle && (
            <span className="animate-shine bg-secondary border border-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest uppercase shadow-sm">
              LOTE +{product.tipo_incremento}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 p-1 bg-background/50 rounded-xl border border-white/5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecrement}
              disabled={currentQty === 0}
              className={cn(
                "w-10 h-10 rounded-lg transition-all",
                currentQty > 0 ? "text-foreground hover:bg-white/5 hover:text-destructive" : "text-muted-foreground/20"
              )}
            >
              <Minus className="w-4 h-4" />
            </Button>

            <div className="flex-1 text-center">
              <span className={cn(
                "text-lg font-black font-mono transition-all duration-300",
                currentQty > 0 ? "text-primary scale-110" : "text-muted-foreground/20"
              )}>
                {currentQty.toString().padStart(2, '0')}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleIncrement}
              className="w-10 h-10 rounded-lg text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-50">
            ADICIONAR {product.tipo_incremento} POR CLIQUE
          </p>
        </div>
      </div>
    </div>
  );
}
