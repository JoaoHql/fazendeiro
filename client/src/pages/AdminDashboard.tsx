import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock3,
  Filter,
  PackageCheck,
  Search,
  ShieldCheck,
  Truck,
  XCircle,
} from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCart, type Order } from '@/contexts/CartContext';
import {
  getOrderLifecycleStatus,
  getOrderStatusTone,
  ORDER_STATUS_LABELS,
} from '@/lib/order-status';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | Order['status'];

export default function AdminDashboard() {
  const { orders, updateOrderStatus } = useCart();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const normalizedOrders = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        lifecycleStatus: getOrderLifecycleStatus(order),
      })),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    return normalizedOrders.filter((order) => {
      const matchesStatus =
        statusFilter === 'all' || order.lifecycleStatus === statusFilter;
      const haystack = [
        order.customer.name,
        order.customer.phone,
        order.id,
        ...order.items.map((item) => item.name),
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = haystack.includes(search.trim().toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [normalizedOrders, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: normalizedOrders.length,
      pending: normalizedOrders.filter((order) => order.lifecycleStatus === 'pending_payment')
        .length,
      paid: normalizedOrders.filter((order) => order.lifecycleStatus === 'paid').length,
      released: normalizedOrders.filter((order) => order.lifecycleStatus === 'released').length,
      blocked: normalizedOrders.filter((order) =>
        ['cancelled', 'expired'].includes(order.lifecycleStatus)
      ).length,
    };
  }, [normalizedOrders]);

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onCartClick={() => {}} onOrdersClick={() => {}} onProfileClick={() => {}} />

      <main className="pb-24 pt-32">
        <div className="container space-y-8">
          <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <ShieldCheck className="h-4 w-4" />
                <span>Operacao e Liberacao</span>
              </div>
              <h1 className="mb-4 text-4xl font-black italic tracking-tighter md:text-5xl">
                Painel <span className="text-primary not-italic">Admin</span>
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Acompanhe pagamentos, libere pedidos e mantenha a agenda de entrega sob
                controle sem sair da linguagem visual do sistema.
              </p>
            </div>

            <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5 lg:max-w-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/70">
                Fluxo operacional
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                Pedido novo entra em aguardando PIX, depois passa por pagamento confirmado
                e por fim liberacao.
              </p>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Pedidos totais"
              value={stats.total}
              subtitle="Base consolidada"
              icon={<PackageCheck className="h-5 w-5" />}
            />
            <MetricCard
              title="Aguardando PIX"
              value={stats.pending}
              subtitle="Acao imediata"
              icon={<Clock3 className="h-5 w-5" />}
              accent="text-yellow-400"
            />
            <MetricCard
              title="Pagos"
              value={stats.paid}
              subtitle="Prontos para liberar"
              icon={<CheckCircle2 className="h-5 w-5" />}
              accent="text-emerald-400"
            />
            <MetricCard
              title="Liberados"
              value={stats.released}
              subtitle="Pedidos processados"
              icon={<Truck className="h-5 w-5" />}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
            <Card className="rounded-3xl border-white/5 bg-card/95 shadow-2xl">
              <CardHeader className="gap-5 border-b border-white/5 pb-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tight">
                      Pedidos para Liberacao
                    </CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Pesquisa por cliente, telefone, id ou item do pedido.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar pedido"
                        className="h-11 min-w-[240px] rounded-2xl border-white/10 bg-background/60 pl-10"
                      />
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-background/40 p-1">
                      <Filter className="ml-2 h-4 w-4 text-primary" />
                      {(['all', 'pending_payment', 'paid', 'released'] as StatusFilter[]).map(
                        (filter) => (
                          <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={cn(
                              'rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all',
                              statusFilter === filter
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-primary'
                            )}
                          >
                            {filter === 'all'
                              ? 'Todos'
                              : ORDER_STATUS_LABELS[filter as Order['status']]}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="px-6 text-xs uppercase tracking-widest text-muted-foreground">
                        Cliente
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                        Entrega
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                        Valor
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-widest text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="px-6 text-right text-xs uppercase tracking-widest text-muted-foreground">
                        Acoes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow className="border-white/5">
                        <TableCell colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          Nenhum pedido encontrado para o filtro atual.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusTone = getOrderStatusTone(order.lifecycleStatus);

                        return (
                          <TableRow key={order.id} className="border-white/5 hover:bg-white/[0.02]">
                            <TableCell className="px-6 py-5">
                              <div>
                                <p className="font-bold text-foreground/90">
                                  {order.customer.name}
                                </p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                  {order.customer.phone} • #{order.id.slice(0, 6).toUpperCase()}
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {order.items.map((item) => item.name).join(', ')}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-semibold">
                                  {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                                </p>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                  {order.deliveryTime}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-black text-primary">
                              R$ {order.total.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  'inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest',
                                  statusTone.bg,
                                  statusTone.text
                                )}
                              >
                                {ORDER_STATUS_LABELS[order.lifecycleStatus]}
                              </span>
                            </TableCell>
                            <TableCell className="px-6">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleStatusChange(order.id, 'paid')}
                                  disabled={order.lifecycleStatus !== 'pending_payment'}
                                  className="rounded-xl bg-emerald-500/10 text-xs font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-30"
                                >
                                  Confirmar PIX
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(order.id, 'released')}
                                  disabled={order.lifecycleStatus !== 'paid'}
                                  className="rounded-xl bg-primary text-xs font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-30"
                                >
                                  Liberar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleStatusChange(order.id, 'cancelled')}
                                  disabled={['released', 'cancelled'].includes(order.lifecycleStatus)}
                                  className="rounded-xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 disabled:opacity-30"
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card className="rounded-3xl border-white/5 bg-card/95 shadow-2xl">
                <CardHeader className="border-b border-white/5 pb-5">
                  <CardTitle className="text-xl font-black tracking-tight">
                    Agenda Rapida
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['11:00', '15:00', '18:00'].map((slot) => {
                    const slotOrders = normalizedOrders.filter(
                      (order) => order.deliveryTime === slot
                    );
                    return (
                      <div
                        key={slot}
                        className="rounded-2xl border border-white/5 bg-secondary/30 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black uppercase tracking-widest text-primary">
                            {slot}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {slotOrders.length} pedidos
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-foreground/80">
                          {slotOrders.filter((order) => order.lifecycleStatus === 'released').length}{' '}
                          liberados,{' '}
                          {slotOrders.filter((order) => order.lifecycleStatus === 'paid').length}{' '}
                          pagos,{' '}
                          {
                            slotOrders.filter(
                              (order) => order.lifecycleStatus === 'pending_payment'
                            ).length
                          }{' '}
                          pendentes.
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-white/5 bg-card/95 shadow-2xl">
                <CardHeader className="border-b border-white/5 pb-5">
                  <CardTitle className="text-xl font-black tracking-tight">
                    Alertas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <AlertRow
                    label="Pagamentos pendentes"
                    value={stats.pending}
                    icon={<Clock3 className="h-4 w-4" />}
                    accent="text-yellow-400"
                  />
                  <AlertRow
                    label="Pedidos bloqueados"
                    value={stats.blocked}
                    icon={<XCircle className="h-4 w-4" />}
                    accent="text-red-400"
                  />
                  <AlertRow
                    label="Prontos para liberar"
                    value={stats.paid}
                    icon={<ShieldCheck className="h-4 w-4" />}
                    accent="text-emerald-400"
                  />
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  accent = 'text-primary',
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="rounded-3xl border-white/5 bg-card/95 shadow-2xl">
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
            {title}
          </p>
          <p className={cn('mt-3 text-4xl font-black tracking-tighter', accent)}>{value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className={cn('rounded-2xl bg-secondary/70 p-3', accent)}>{icon}</div>
      </CardContent>
    </Card>
  );
}

function AlertRow({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-secondary/30 p-4">
      <div className="flex items-center gap-3">
        <div className={cn('rounded-xl bg-background/80 p-2', accent)}>{icon}</div>
        <p className="text-sm text-foreground/80">{label}</p>
      </div>
      <span className={cn('text-lg font-black', accent)}>{value}</span>
    </div>
  );
}
