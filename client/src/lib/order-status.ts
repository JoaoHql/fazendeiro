import type { Order } from '@/contexts/CartContext';

export const ORDER_STATUS_LABELS: Record<Order['status'], string> = {
  pending_payment: 'Aguardando PIX',
  paid: 'Pagamento Confirmado',
  released: 'Pedido Liberado',
  cancelled: 'Cancelado',
  expired: 'Expirado',
};

export function getOrderLifecycleStatus(order: Order): Order['status'] {
  if (order.status !== 'pending_payment') {
    return order.status;
  }

  const [year, month, day] = order.deliveryDate.split('-').map(Number);
  const [hours, minutes] = order.deliveryTime.split(':').map(Number);
  const deliveryDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const expirationLimit = new Date(deliveryDateTime.getTime() - 90 * 60 * 1000);

  return new Date() > expirationLimit ? 'expired' : order.status;
}

export function getOrderStatusTone(status: Order['status']) {
  switch (status) {
    case 'pending_payment':
      return { bg: 'bg-yellow-500/10', text: 'text-yellow-500' };
    case 'paid':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400' };
    case 'released':
      return { bg: 'bg-primary/10', text: 'text-primary' };
    case 'cancelled':
      return { bg: 'bg-red-500/10', text: 'text-red-500' };
    case 'expired':
      return { bg: 'bg-orange-500/10', text: 'text-orange-400' };
  }
}
