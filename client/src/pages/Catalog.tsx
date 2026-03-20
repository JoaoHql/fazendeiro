import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProductCard, { Product } from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { Leaf } from 'lucide-react';

/**
 * Página Principal - Catálogo de Produtos
 * Design: Premium Farm Edition (Organic Dark / Gold)
 */
export default function Catalog() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Wolf Bundle',
        price: 45.00,
        description: 'Seleção premium para clientes exigentes.',
        tipo_incremento: 5,
        isBundle: true,
        pixKey: 'wolf-pix-key-123',
      },
      {
        id: '2',
        name: 'KS Special',
        price: 35.00,
        description: 'Lote exclusivo de colheita selecionada.',
        tipo_incremento: 5,
        isBundle: true,
        pixKey: 'ks-pix-key-456',
      },
      {
        id: '3',
        name: 'Produto Orgânico A',
        price: 15.00,
        description: 'Fresco, direto da terra para sua mesa.',
        tipo_incremento: 1,
        pixKey: 'prod-a-pix-789',
      },
      {
        id: '4',
        name: 'Produto Orgânico B',
        price: 22.50,
        description: 'Sabor autêntico e qualidade garantida.',
        tipo_incremento: 1,
        pixKey: 'prod-b-pix-012',
      },
      {
        id: '5',
        name: 'Produto Orgânico C',
        price: 18.00,
        description: 'Produção artesanal com amor.',
        tipo_incremento: 1,
        pixKey: 'prod-c-pix-345',
      },
      {
        id: '6',
        name: 'Produto Orgânico D',
        price: 28.00,
        description: 'O melhor da estação disponível hoje.',
        tipo_incremento: 1,
        pixKey: 'prod-d-pix-678',
      },
    ];
    setProducts(mockProducts);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Dynamic Header */}
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onOrdersClick={() => {}}
        onProfileClick={() => {}}
      />

      {/* Main Content */}
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Section Hero/Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3">
                <Leaf className="w-4 h-4" />
                <span>Colheita do Dia</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 italic">
                Mercado <span className="text-primary not-italic">Premium</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Produtos selecionados com rigorosa qualidade orgânica. 
                Escolha seus itens abaixo e confirme seu pedido via PIX.
              </p>
            </div>
            
            <div className="hidden lg:block">
               <div className="h-px w-24 bg-primary/20 mb-4" />
               <p className="text-[10px] text-primary/40 uppercase tracking-widest font-black text-right">
                 Fazendeiro Market <br/> Est. 2026
               </p>
            </div>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
              <p className="text-muted-foreground font-medium tracking-wide">
                Preparando os produtos da fazenda...
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Cart Drawer Overlay & Content */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
