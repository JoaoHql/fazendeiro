import Header from '@/components/Header';
import { useCart, Order } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, Copy, CheckCircle2, Clock, Calendar, Package } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * Página Meus Pedidos - Premium Farm Edition
 */
export default function MyOrders() {
  const { orders, cancelOrder } = useCart();

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
    toast.success('Pedido cancelado com sucesso');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiada para a área de transferência`);
  };

  const isOrderExpired = (order: Order) => {
    if (order.status !== 'pending') return false;
    const [year, month, day] = order.deliveryDate.split('-').map(Number);
    const [hours, minutes] = order.deliveryTime.split(':').map(Number);
    const deliveryDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const now = new Date();
    const limitTime = new Date(deliveryDateTime.getTime() - 90 * 60 * 1000);
    return now > limitTime;
  };

  const getStatusBadge = (order: Order) => {
    const isExpired = isOrderExpired(order);
    const status = isExpired ? 'cancelled' : order.status;

    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-500',
          label: 'Aguardando PIX',
          icon: <Clock className="w-3 h-3" />
        };
      case 'confirmed':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-500',
          label: 'Pago e Confirmado',
          icon: <CheckCircle2 className="w-3 h-3" />
        };
      case 'cancelled':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          label: isExpired ? 'Cancelado (Expirado)' : 'Cancelado',
          icon: <AlertCircle className="w-3 h-3" />
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onCartClick={() => {}}
        onOrdersClick={() => {}}
        onProfileClick={() => {}}
      />

      <main className="pt-32 pb-24">
        <div className="container max-w-4xl">
          {/* Section Header */}
          <div className="mb-12">
             <div className="flex items-center gap-2 text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3">
                <Package className="w-4 h-4" />
                <span>Gestão de Reservas</span>
              </div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 italic">
              Meus <span className="text-primary not-italic">Pedidos</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Acompanhe o status de suas colheitas e realize o pagamento.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-card rounded-3xl p-16 text-center border border-white/5 shadow-2xl">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground font-medium mb-8">
                Sua lista de histórico está vazia no momento.
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 rounded-xl font-black uppercase tracking-widest text-xs"
              >
                Explorar Catálogo
              </Button>
            </div>
          ) : (
            <div className="grid gap-8">
              {orders.map((order) => {
                const isExpired = isOrderExpired(order);
                const status = getStatusBadge(order);

                return (
                  <div
                    key={order.id}
                    className="group bg-card rounded-3xl border border-white/5 hover:border-primary/20 transition-all duration-300 shadow-xl overflow-hidden"
                  >
                    {/* Upper Section */}
                    <div className="p-8 pb-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-xl font-black tracking-tight text-foreground/90">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </h3>
                            <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5", status.bg, status.text)}>
                              {status.icon}
                              {status.label}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Realizado em {new Date(order.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                           <p className="text-[10px] text-primary/40 uppercase tracking-widest font-black mb-1">Valor Total</p>
                           <p className="text-3xl font-black text-primary tracking-tighter">
                            R$ {order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Info Bar */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/50 rounded-2xl border border-white/5 mb-8">
                         <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5">
                               <Calendar className="w-3 h-3" /> Entrega
                            </span>
                            <p className="text-sm font-bold">{formatDate(order.deliveryDate)}</p>
                         </div>
                         <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5">
                               <Clock className="w-3 h-3" /> Horário
                            </span>
                            <p className="text-sm font-bold">{order.deliveryTime}</p>
                         </div>
                         <div className="col-span-2 space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5">
                               <CheckCircle2 className="w-3 h-3" /> Pagamento
                            </span>
                            <p className={cn("text-sm font-black italic", order.status === 'confirmed' ? "text-green-500" : "text-yellow-500/70")}>
                               {order.status === 'confirmed' ? "Confirmado" : "Aguardando PIX"}
                            </p>
                         </div>
                      </div>
                    </div>

                    {/* PIX Keys Section */}
                    <div className="bg-background/30 p-8 pt-0">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Itens & Chaves de Pagamento</h4>
                      <div className="grid gap-3">
                        {order.items.map((item) => (
                          <div key={item.productId} className="bg-secondary/30 rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary font-black text-xs">
                                  {item.quantity}x
                               </div>
                               <div>
                                  <p className="font-bold text-foreground/80 leading-tight">{item.name}</p>
                                  <p className="text-xs text-primary font-black tracking-tight">R$ {(item.price * item.quantity).toFixed(2)}</p>
                               </div>
                            </div>

                            {item.pixKey && order.status === 'pending' && !isExpired && (
                              <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 p-2 pl-4 rounded-xl flex-1 sm:max-w-[240px]">
                                <code className="text-[10px] font-mono truncate flex-1 text-primary/80">{item.pixKey}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(item.pixKey!, `PIX ${item.name}`)}
                                  className="h-8 w-8 p-0 hover:bg-primary/20 text-primary"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-secondary/20 flex flex-col sm:flex-row gap-4">
                      {order.status === 'pending' && !isExpired && (
                        <Button
                          onClick={() => handleCancelOrder(order.id)}
                          variant="ghost"
                          className="flex-1 h-12 text-red-500 hover:bg-red-500/10 font-bold uppercase tracking-widest text-[10px] rounded-xl"
                        >
                          Cancelar Pedido
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl border border-white/5"
                        onClick={() => toast.info(`Pedido #${order.id.slice(0, 8).toUpperCase()}`)}
                      >
                        Ver Detalhes Completos
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
