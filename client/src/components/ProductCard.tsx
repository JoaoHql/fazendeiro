import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

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
 * Card de Produto
 * Design: Minimalismo Corporativo Moderno
 * - Sincronizado com o Carrinho para manter o valor atualizado
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { cartItems, addToCart, updateCartItem } = useCart();
  
  // Buscar quantidade atual no carrinho
  const cartItem = cartItems.find(item => item.productId === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleIncrement = () => {
    const newQuantity = quantity + product.tipo_incremento;
    
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
      updateCartItem(product.id, newQuantity);
    }
  };

  const subtotal = product.price * quantity;

  return (
    <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-border">
      {/* Header do Card */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground mb-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground">
            {product.description}
          </p>
        )}
      </div>

      {/* Tag de Lote */}
      {product.isBundle && (
        <div className="mb-4 inline-block">
          <span className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
            Lote: +{product.tipo_incremento} unidades
          </span>
        </div>
      )}

      {/* Preço */}
      <div className="mb-6">
        <div className="flex justify-between items-baseline">
          <p className="text-2xl font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </p>
          {quantity > 0 && (
            <p className="text-sm font-semibold text-muted-foreground">
              Total: R$ {subtotal.toFixed(2)}
            </p>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
          {quantity > 0 ? `${quantity} unidades selecionadas` : 'Preço unitário'}
        </p>
      </div>

      {/* Stepper de Quantidade */}
      <div className="flex items-center gap-3 bg-secondary rounded-lg p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={quantity === 0}
          className={`flex-shrink-0 ${
            quantity === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          <Minus className="w-4 h-4" />
        </Button>

        <div className="flex-1 text-center font-bold text-foreground">
          {quantity}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          className="flex-shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Incremento Info */}
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Adicionar em lotes de {product.tipo_incremento}
      </p>
    </div>
  );
}
