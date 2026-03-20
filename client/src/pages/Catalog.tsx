import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProductCard, { Product } from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';

/**
 * Página Principal - Catálogo de Produtos
 * Design: Minimalismo Corporativo Moderno
 * - Header fixo no topo com ícones
 * - Grid responsivo de produtos
 * - Fundo em cinza ultra-claro para destacar cards brancos
 * - Drawer de carrinho desliza da direita
 */
export default function Catalog() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Simular carregamento de produtos
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Wolf',
        price: 45.00,
        description: 'Produto premium em lote',
        tipo_incremento: 5,
        isBundle: true,
        pixKey: 'wolf-pix-key-123',
      },
      {
        id: '2',
        name: 'KS',
        price: 35.00,
        description: 'Produto especial em lote',
        tipo_incremento: 5,
        isBundle: true,
        pixKey: 'ks-pix-key-456',
      },
      {
        id: '3',
        name: 'Produto A',
        price: 15.00,
        description: 'Produto unitário',
        tipo_incremento: 1,
        pixKey: 'prod-a-pix-789',
      },
      {
        id: '4',
        name: 'Produto B',
        price: 22.50,
        description: 'Produto unitário',
        tipo_incremento: 1,
        pixKey: 'prod-b-pix-012',
      },
      {
        id: '5',
        name: 'Produto C',
        price: 18.00,
        description: 'Produto unitário',
        tipo_incremento: 1,
        pixKey: 'prod-c-pix-345',
      },
      {
        id: '6',
        name: 'Produto D',
        price: 28.00,
        description: 'Produto unitário',
        tipo_incremento: 1,
        pixKey: 'prod-d-pix-678',
      },
      {
        id: '7',
        name: 'Produto E',
        price: 32.00,
        description: 'Produto unitário',
        tipo_incremento: 1,
        pixKey: 'prod-e-pix-901',
      },
      {
        id: '8',
        name: 'Produto F',
        price: 25.00,
        description: 'Produto unitário',
        tipo_incremento: 1,
        pixKey: 'prod-f-pix-234',
      },
    ];
    setProducts(mockProducts);
  }, []);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onOrdersClick={() => {}}
        onProfileClick={() => {}}
      />

      {/* Conteúdo Principal */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Catálogo de Produtos
            </h1>
            <p className="text-muted-foreground">
              Selecione os produtos desejados e confirme seu pedido
            </p>
          </div>


          {/* Grid de Produtos */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          )}
        </div>
      </main>

      {/* Drawer de Carrinho */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
