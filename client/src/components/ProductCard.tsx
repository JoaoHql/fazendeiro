import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart, CartItem } from '@/contexts/CartContext';
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
 * - Fundo branco, bordas arredondadas, sombra suave
 * - Stepper com lógica de incremento (1 ou 5)
 * - Tag discreta para produtos em lote
 * - Micro-interações ao hover
 */
export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const { addToCart, updateCartItem } = useCart();

  const handleIncrement = () => {
    const newQuantity = quantity + product.tipo_incremento;
    setQuantity(newQuantity);
    
    if (quantity === 0) {
      // Primeira adição ao carrinho
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
      
      if (newQuantity === 0) {
        // Remover do carrinho
        updateCartItem(product.id, 0);
      } else {
        updateCartItem(product.id, newQuantity);
      }
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
        <p className="text-2xl font-bold text-primary">
          R$ {product.price.toFixed(2)}
        </p>
        {quantity > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            Subtotal: R$ {subtotal.toFixed(2)}
          </p>
        )}
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

        <input
          type="number"
          value={quantity}
          readOnly
          className="flex-1 text-center bg-transparent border-0 text-foreground font-semibold outline-none"
        />

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
        Incremento: {product.tipo_incremento} unidade{product.tipo_incremento > 1 ? 's' : ''}
      </p>
    </div>
  );
}
