import { useState } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  tipo_incremento: number; // 1 ou 5
  isBundle?: boolean; // Para produtos como Wolf e KS
  pixKey?: string;
}

interface ProductCardProps {
  product: Product;
}

/**
 * Card de Produto - Premium Farm Edition
 * Design: Organic Dark / Gold
 * - Premium hover effects (scale + subtle ring)
 * - Custom Gold/Dark aesthetics
 * - Meta-information with "Shine" effect
 */
export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const { addToCart, updateCartItem } = useCart();

  const handleIncrement = () => {
    const newQuantity = quantity + product.tipo_incremento;
    setQuantity(newQuantity);
    
    if (quantity === 0) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: product.tipo_incremento,
        incrementType: product.tipo_incremento,
        pixKey: product.pixKey,
      });
    } else {
      updateCartItem(product.id, newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQuantity = Math.max(0, quantity - product.tipo_incremento);
      setQuantity(newQuantity);
      updateCartItem(product.id, newQuantity);
    }
  };

  const subtotal = product.price * quantity;

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="p-6 relative z-10">
        {/* Header Section */}
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

        {/* Pricing & Tag */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-2xl font-black text-primary">
              R$ {product.price.toFixed(2)}
            </p>
            {quantity > 0 && (
              <p className="text-xs font-medium text-primary/60 tracking-wider uppercase mt-0.5">
                Total: R$ {subtotal.toFixed(2)}
              </p>
            )}
          </div>

          {product.isBundle && (
            <span className="animate-shine bg-secondary border border-primary/20 text-primary text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest uppercase shadow-sm">
              Lote +{product.tipo_incremento}
            </span>
          )}
        </div>

        {/* Action Section - Stepper */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-1 bg-background/50 rounded-xl border border-white/5 group-hover:border-primary/10 transition-colors">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecrement}
              disabled={quantity === 0}
              className={cn(
                "w-10 h-10 rounded-lg transition-all",
                quantity > 0 ? "text-foreground hover:bg-white/5 hover:text-destructive" : "text-muted-foreground"
              )}
            >
              <Minus className="w-4 h-4" />
            </Button>

            <div className="flex-1 text-center">
              <span className={cn(
                "text-lg font-black font-mono transition-colors",
                quantity > 0 ? "text-primary" : "text-muted-foreground/30"
              )}>
                {quantity.toString().padStart(2, '0')}
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
            Adicionar {product.tipo_incremento} por clique
          </p>
        </div>
      </div>
    </div>
  );
}
