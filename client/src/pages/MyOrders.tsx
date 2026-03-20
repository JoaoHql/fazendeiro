import Header from '@/components/Header';
import { useCart, Order } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Página Meus Pedidos
 * Design: Minimalismo Corporativo Moderno
 * - Lista de histórico de pedidos
 * - Badges visuais para status (Pendente, Confirmado, Cancelado)
 * - Botão de cancelamento para pedidos pendentes
 * - Lógica de cancelamento automático (1:30h antes do roteiro)
 * - Chaves PIX por produto com função de copiar
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

    // Parse deliveryDate (YYYY-MM-DD) and deliveryTime (HH:mm) correctly in local time
    const [year, month, day] = order.deliveryDate.split('-').map(Number);
    const [hours, minutes] = order.deliveryTime.split(':').map(Number);
    
    // Month in JS Date is 0-indexed
    const deliveryDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

    const now = new Date();
    // 90 minutes = 1:30h
    const limitTime = new Date(deliveryDateTime.getTime() - 90 * 60 * 1000);

    return now > limitTime;
  };

  const getStatusBadge = (order: Order) => {
    const isExpired = isOrderExpired(order);
    const status = isExpired ? 'cancelled' : order.status;

    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-800',
          label: 'Pendente',
          borderColor: 'border-yellow-200',
        };
      case 'confirmed':
        return {
          bg: 'bg-green-50',
          text: 'text-green-800',
          label: 'Confirmado',
          borderColor: 'border-green-200',
        };
      case 'cancelled':
        return {
          bg: 'bg-red-50',
          text: 'text-red-800',
          label: isExpired ? 'Cancelado (Expirado)' : 'Cancelado',
          borderColor: 'border-red-200',
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <Header
        onCartClick={() => {}}
        onOrdersClick={() => {}}
        onProfileClick={() => {}}
      />

      {/* Conteúdo Principal */}
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Meus Pedidos
            </h1>
            <p className="text-muted-foreground">
              Histórico de seus pedidos realizados e chaves PIX para pagamento
            </p>
          </div>

          {/* Lista de Pedidos */}
          {orders.length === 0 ? (
            <div className="bg-card rounded-lg shadow-md p-12 text-center border border-border">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Você ainda não realizou nenhum pedido
              </p>
              <a
                href="/"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Ir ao Catálogo
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isExpired = isOrderExpired(order);
                const statusBadge = getStatusBadge(order);

                return (
                  <div
                    key={order.id}
                    className={`bg-card rounded-lg shadow-md p-6 border ${statusBadge.borderColor} transition-all duration-200 hover:shadow-lg`}
                  >
                    {/* Header do Pedido */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">
                            Pedido #{order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${statusBadge.bg} ${statusBadge.text} border-current`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Criado em {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          R$ {order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Detalhes de Entrega */}
                    <div className="bg-secondary rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between text-sm md:flex-col md:gap-1">
                        <span className="text-muted-foreground">
                          Data de Entrega:
                        </span>
                        <span className="font-semibold text-foreground">
                          {formatDate(order.deliveryDate)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm md:flex-col md:gap-1">
                        <span className="text-muted-foreground">
                          Horário:
                        </span>
                        <span className="font-semibold text-foreground">
                          {order.deliveryTime}
                        </span>
                      </div>
                    </div>

                    {/* Itens do Pedido e Chaves PIX */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        Itens e Chaves PIX para Pagamento
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.productId}
                            className="bg-background rounded-lg border border-border p-3 space-y-2"
                          >
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-foreground">
                                {item.name} x {item.quantity}
                              </span>
                              <span className="font-bold text-primary">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            
                            {item.pixKey && order.status === 'pending' && !isExpired && (
                              <div className="flex items-center justify-between gap-2 bg-secondary/50 p-2 rounded border border-dashed border-primary/30">
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Chave PIX do Produto</p>
                                  <p className="text-xs font-mono truncate text-foreground">{item.pixKey}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(item.pixKey!, `Chave PIX de ${item.name}`)}
                                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Informações Adicionais (Detalhes) */}
                    <div className="mb-6 pt-4 border-t border-border">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Informações Adicionais
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between md:flex-col md:gap-1">
                          <span className="text-muted-foreground">Data de Criação:</span>
                          <span className="font-medium text-foreground">
                            {new Date(order.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex justify-between md:flex-col md:gap-1">
                          <span className="text-muted-foreground">Pagamento:</span>
                          <span className={`font-bold ${order.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.status === 'confirmed' ? 'Confirmado ✅' : 'Aguardando PIX ⏳'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-3 pt-2 border-t border-border">
                      {order.status === 'pending' && !isExpired && (
                        <Button
                          onClick={() => handleCancelOrder(order.id)}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Cancelar Pedido
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
                        onClick={() => toast.info(`Pedido #${order.id.slice(0, 8).toUpperCase()} - ${statusBadge.label}`)}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Detalhes
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
