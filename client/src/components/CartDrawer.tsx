import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DELIVERY_TIMES = ['11:00', '15:00', '18:00'];

/**
 * Carrinho Lateral (Drawer)
 * Design: Minimalismo Corporativo Moderno
 * - Desliza da direita com overlay semi-transparente
 * - Lista de itens com controles de quantidade
 * - Rodapé fixo com total, data, horário e botão de confirmação
 */
export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateCartItem, getCartTotal, clearCart, addOrder } = useCart();
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const total = getCartTotal();
  const isFormValid = deliveryDate && selectedTime;

  const handleConfirmOrder = () => {
    if (!isFormValid) {
      toast.error('Selecione a data e horário de entrega');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Adicione itens ao carrinho');
      return;
    }

    // Criar novo pedido
    const order = {
      id: nanoid(),
      items: cartItems,
      total,
      deliveryDate,
      deliveryTime: selectedTime,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    toast.success('Pedido confirmado com sucesso!');
    clearCart();
    setDeliveryDate('');
    setSelectedTime('');
    onClose();
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartItem(productId, newQuantity);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Carrinho</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carrinho vazio</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-secondary rounded-lg p-4 space-y-3"
              >
                {/* Nome e Preço */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      R$ {item.price.toFixed(2)} cada
                    </p>
                  </div>
                  <p className="font-bold text-primary">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-2 bg-background rounded p-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(
                        item.productId,
                        Math.max(0, item.quantity - item.incrementType)
                      )
                    }
                    disabled={item.quantity === 0}
                    className="flex-shrink-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <input
                    type="number"
                    value={item.quantity}
                    readOnly
                    className="flex-1 text-center bg-transparent border-0 text-foreground font-semibold outline-none text-sm"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(
                        item.productId,
                        item.quantity + item.incrementType
                      )
                    }
                    className="flex-shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé Fixo */}
        {cartItems.length > 0 && (
          <div className="border-t border-border p-6 space-y-4 bg-secondary">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-foreground">
                Total:
              </span>
              <span className="text-2xl font-bold text-primary">
                R$ {total.toFixed(2)}
              </span>
            </div>

            {/* Data de Entrega */}
            <div className="space-y-2">
              <Label htmlFor="delivery-date" className="text-foreground font-medium">
                Data de Entrega
              </Label>
              <Input
                id="delivery-date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="border-border focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Horário */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">
                Horário de Entrega
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {DELIVERY_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedTime === time
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Informação do PIX */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>Atenção:</strong> O pagamento via PIX deve ser realizado até 1:30h antes do horário de entrega. Pedidos sem confirmação de pagamento serão cancelados automaticamente.
              </p>
            </div>

            {/* Botão Confirmar */}
            <Button
              onClick={handleConfirmOrder}
              disabled={!isFormValid || cartItems.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Pedido
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
