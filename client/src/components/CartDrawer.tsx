import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Calendar, Clock, CreditCard, Minus, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DELIVERY_TIMES = ['11:00', '15:00', '18:00'];

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateCartItem, getCartTotal, clearCart, addOrder } = useCart();
  const { user } = useAuth();
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const total = getCartTotal();
  const isFormValid = deliveryDate && selectedTime;

  const handleConfirmOrder = () => {
    if (!isFormValid) {
      toast.error('Selecione a data e horario de entrega');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Adicione itens ao carrinho');
      return;
    }

    if (!user) {
      toast.error('Usuario nao autenticado');
      return;
    }

    addOrder({
      id: nanoid(),
      items: cartItems,
      total,
      deliveryDate,
      deliveryTime: selectedTime,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      customer: {
        userId: user.id,
        name: user.name,
        phone: user.phone,
      },
    });

    toast.success('Pedido enviado para liberacao');
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
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col border-l border-white/5 bg-card shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-white/5 p-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">MEU CARRINHO</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary">
              Finalize seu pedido
            </p>
          </div>
          <button
            onClick={onClose}
            className="group rounded-xl bg-secondary p-3 transition-colors hover:bg-white/5"
          >
            <X className="h-5 w-5 text-foreground transition-transform group-hover:rotate-90" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-8">
          {cartItems.length === 0 ? (
            <div className="py-20 text-center opacity-30">
              <ShoppingBag className="mx-auto mb-4 h-16 w-16" />
              <p className="text-xs font-bold uppercase tracking-widest">Carrinho Vazio</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId}
                className="group rounded-2xl border border-white/5 bg-secondary/50 p-5 transition-all hover:border-primary/20"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-black leading-tight text-foreground/90">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Unidade: R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xl font-black text-primary">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-background/50 p-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity - item.incrementType)
                    }
                    className="h-10 w-10 text-foreground/40 transition-colors hover:text-destructive"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="flex-1 text-center font-mono text-lg font-black text-primary">
                    {item.quantity.toString().padStart(2, '0')}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity + item.incrementType)
                    }
                    className="h-10 w-10 text-primary transition-colors hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="space-y-6 border-t border-white/5 bg-secondary/80 p-8 backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  <Calendar className="h-3 w-3 text-primary" /> Data da Entrega
                </Label>
                <Input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-12 rounded-xl border-white/5 bg-background font-medium text-foreground focus:border-primary focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  <Clock className="h-3 w-3 text-primary" /> Horario Disponivel
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {DELIVERY_TIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'h-12 rounded-xl text-sm font-bold transition-all',
                        selectedTime === time
                          ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                          : 'border border-white/5 bg-background/50 text-foreground/40 hover:border-primary/40 hover:text-primary'
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between pt-2">
              <span className="mb-1 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                Subtotal
              </span>
              <span className="text-3xl font-black tracking-tighter text-primary">
                R$ {total.toFixed(2)}
              </span>
            </div>

            <div className="animate-shine flex items-start gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-[10px] font-medium uppercase tracking-wider text-primary/70">
                Pagamento via <span className="font-black">PIX</span> em ate 1:30h antes da
                entrega. O admin faz a liberacao do pedido apos validar o pagamento.
              </p>
            </div>

            <Button
              onClick={handleConfirmOrder}
              disabled={!isFormValid}
              className="h-14 w-full rounded-2xl bg-primary text-base font-black uppercase tracking-widest text-primary-foreground shadow-xl transition-all hover:bg-primary/90 disabled:grayscale disabled:opacity-20"
            >
              Enviar Pedido
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
