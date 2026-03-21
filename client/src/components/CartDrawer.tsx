import { useState } from 'react';
import { X, Plus, Minus, Calendar, Clock, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DELIVERY_TIMES = ['11:00', '15:00', '18:00'];

/**
 * Carrinho Lateral (Drawer) - Premium Farm Edition
 * Design: Organic Dark / Gold
 * - Backdrop blur glass effect for overlay
 * - High-contrast ivory text on dark surfaces
 * - Sophisticated input controls
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
      {/* Premium Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      {/* Drawer Content */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-white/5 shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col",
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Elegant Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">MEU CARRINHO</h2>
            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">Finalize seu pedido</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-secondary rounded-xl hover:bg-white/5 transition-colors group"
          >
            <X className="w-5 h-5 text-foreground group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 opacity-30">
               <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
               <p className="font-bold tracking-widest uppercase text-xs">Carrinho Vazio</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId}
                className="group bg-secondary/50 rounded-2xl p-5 border border-white/5 hover:border-primary/20 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-lg text-foreground/90 leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                      Unidade: R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-black text-primary text-xl">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Micro Stepper */}
                <div className="flex items-center gap-4 bg-background/50 rounded-xl p-1.5 border border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - item.incrementType)}
                    className="h-10 w-10 text-foreground/40 hover:text-destructive transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <span className="flex-1 text-center font-black font-mono text-primary text-lg">
                    {item.quantity.toString().padStart(2, '0')}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + item.incrementType)}
                    className="h-10 w-10 text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sticky Checkout Section */}
        {cartItems.length > 0 && (
          <div className="border-t border-white/5 p-8 space-y-6 bg-secondary/80 backdrop-blur-xl">
            {/* Delivery Details Inputs */}
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                   <Calendar className="w-3 h-3 text-primary" /> Data da Entrega
                </Label>
                <Input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-background border-white/5 focus:border-primary focus:ring-primary/20 h-12 rounded-xl text-foreground font-medium"
                />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                   <Clock className="w-3 h-3 text-primary" /> Horário Disponível
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {DELIVERY_TIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "h-12 rounded-xl font-bold transition-all text-sm",
                        selectedTime === time
                          ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                          : "bg-background/50 border border-white/5 text-foreground/40 hover:border-primary/40 hover:text-primary"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Indicator */}
            <div className="flex justify-between items-end pt-2">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Subtotal</span>
              <span className="text-3xl font-black text-primary tracking-tighter">
                R$ {total.toFixed(2)}
              </span>
            </div>

            {/* PIX Notice */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-4 items-start animate-shine">
               <CreditCard className="w-5 h-5 text-primary shrink-0 mt-0.5" />
               <p className="text-[10px] text-primary/70 font-medium leading-relaxed uppercase tracking-wider">
                 Pagamento via <span className="font-black">PIX</span> em até 1:30h antes da entrega. Pedidos não pagos são cancelados.
               </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleConfirmOrder}
              disabled={!isFormValid}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl disabled:opacity-20 disabled:grayscale"
            >
              Confirmar Reserva
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
