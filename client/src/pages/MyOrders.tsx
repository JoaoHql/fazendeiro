import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Package,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, type Order } from '@/contexts/CartContext';
import {
  getOrderLifecycleStatus,
  getOrderStatusTone,
  ORDER_STATUS_LABELS,
} from '@/lib/order-status';
import { cn } from '@/lib/utils';

function getStatusIcon(status: Order['status']) {
  switch (status) {
    case 'pending_payment':
      return <Clock className="h-3 w-3" />;
    case 'paid':
      return <CheckCircle2 className="h-3 w-3" />;
    case 'released':
      return <Truck className="h-3 w-3" />;
    case 'cancelled':
    case 'expired':
      return <AlertCircle className="h-3 w-3" />;
  }
}

export default function MyOrders() {
  const { user } = useAuth();
  const { orders, cancelOrder } = useCart();

  const customerOrders = orders.filter((order) => order.customer.userId === user?.id);

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
    toast.success('Pedido cancelado com sucesso');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiada para a area de transferencia`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onCartClick={() => {}} onOrdersClick={() => {}} onProfileClick={() => {}} />

      <main className="pb-24 pt-32">
        <div className="container max-w-4xl">
          <div className="mb-12">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Package className="h-4 w-4" />
              <span>Gestao de Reservas</span>
            </div>
            <h1 className="mb-2 text-4xl font-black italic tracking-tighter">
              Meus <span className="text-primary not-italic">Pedidos</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Acompanhe o pagamento, a liberacao e o andamento de cada reserva.
            </p>
          </div>

          {customerOrders.length === 0 ? (
            <div className="rounded-3xl border border-white/5 bg-card p-16 text-center shadow-2xl">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                <AlertCircle className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <p className="mb-8 font-medium text-muted-foreground">
                Seu historico de pedidos esta vazio no momento.
              </p>
              <Button
                onClick={() => (window.location.href = '/')}
                className="h-12 rounded-xl bg-primary px-8 text-xs font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Explorar Catalogo
              </Button>
            </div>
          ) : (
            <div className="grid gap-8">
              {customerOrders.map((order) => {
                const lifecycleStatus = getOrderLifecycleStatus(order);
                const statusTone = getOrderStatusTone(lifecycleStatus);

                return (
                  <div
                    key={order.id}
                    className="group overflow-hidden rounded-3xl border border-white/5 bg-card shadow-xl transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="p-8 pb-0">
                      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="text-xl font-black tracking-tight text-foreground/90">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </h3>
                            <div
                              className={cn(
                                'flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest',
                                statusTone.bg,
                                statusTone.text
                              )}
                            >
                              {getStatusIcon(lifecycleStatus)}
                              {ORDER_STATUS_LABELS[lifecycleStatus]}
                            </div>
                          </div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Realizado em {new Date(order.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-primary/40">
                            Valor Total
                          </p>
                          <p className="text-3xl font-black tracking-tighter text-primary">
                            R$ {order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-8 grid grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-secondary/50 p-4 md:grid-cols-4">
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Calendar className="h-3 w-3" /> Entrega
                          </span>
                          <p className="text-sm font-bold">{formatDate(order.deliveryDate)}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Clock className="h-3 w-3" /> Horario
                          </span>
                          <p className="text-sm font-bold">{order.deliveryTime}</p>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <ShieldCheck className="h-3 w-3" /> Fluxo
                          </span>
                          <p className={cn('text-sm font-black italic', statusTone.text)}>
                            {lifecycleStatus === 'pending_payment' &&
                              'Aguardando pagamento e validacao do admin'}
                            {lifecycleStatus === 'paid' &&
                              'Pagamento aprovado, aguardando liberacao'}
                            {lifecycleStatus === 'released' &&
                              'Pedido liberado para entrega'}
                            {lifecycleStatus === 'cancelled' && 'Pedido cancelado'}
                            {lifecycleStatus === 'expired' && 'Prazo de pagamento expirado'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background/30 p-8 pt-0">
                      <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Itens e Chaves de Pagamento
                      </h4>
                      <div className="grid gap-3">
                        {order.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-secondary/30 p-4 sm:flex-row sm:items-center"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-xs font-black text-primary">
                                {item.quantity}x
                              </div>
                              <div>
                                <p className="leading-tight font-bold text-foreground/80">
                                  {item.name}
                                </p>
                                <p className="text-xs font-black tracking-tight text-primary">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {item.pixKey && lifecycleStatus === 'pending_payment' && (
                              <div className="flex flex-1 items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-2 pl-4 sm:max-w-[240px]">
                                <code className="flex-1 truncate text-[10px] font-mono text-primary/80">
                                  {item.pixKey}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(item.pixKey!, `PIX ${item.name}`)}
                                  className="h-8 w-8 p-0 text-primary hover:bg-primary/20"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 bg-secondary/20 p-6 sm:flex-row">
                      {lifecycleStatus === 'pending_payment' && (
                        <Button
                          onClick={() => handleCancelOrder(order.id)}
                          variant="ghost"
                          className="h-12 flex-1 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10"
                        >
                          Cancelar Pedido
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        className="h-12 flex-1 rounded-xl border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-white/10"
                        onClick={() =>
                          toast.info(`Status atual: ${ORDER_STATUS_LABELS[lifecycleStatus]}`)
                        }
                      >
                        Ver Atualizacao
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
