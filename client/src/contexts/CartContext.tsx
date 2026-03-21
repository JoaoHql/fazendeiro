import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  incrementType: number;
  pixKey?: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'released'
  | 'cancelled'
  | 'expired';

export interface OrderCustomer {
  userId: string;
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryDate: string;
  deliveryTime: string;
  status: OrderStatus;
  createdAt: string;
  customer: OrderCustomer;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart_items';
const ORDERS_STORAGE_KEY = 'orders';

function normalizeStoredOrder(value: any): Order | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const legacyStatusMap: Record<string, OrderStatus> = {
    pending: 'pending_payment',
    confirmed: 'paid',
    cancelled: 'cancelled',
    pending_payment: 'pending_payment',
    paid: 'paid',
    released: 'released',
    expired: 'expired',
  };

  if (!value.id || !Array.isArray(value.items)) {
    return null;
  }

  return {
    id: String(value.id),
    items: value.items,
    total: Number(value.total ?? 0),
    deliveryDate: String(value.deliveryDate ?? ''),
    deliveryTime: String(value.deliveryTime ?? ''),
    status: legacyStatusMap[String(value.status)] ?? 'pending_payment',
    createdAt: String(value.createdAt ?? new Date().toISOString()),
    customer: {
      userId: String(value.customer?.userId ?? 'legacy-customer'),
      name: String(value.customer?.name ?? 'Cliente legado'),
      phone: String(value.customer?.phone ?? 'nao informado'),
    },
  };
}

function parseStoredOrders(rawValue: string | null) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map((order) => normalizeStoredOrder(order))
      .filter((order): order is Order => order !== null);
  } catch (error) {
    console.error('Erro ao restaurar pedidos:', error);
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao restaurar carrinho:', error);
      }
    }

    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    setOrders(parseStoredOrders(savedOrders));
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY && event.newValue) {
        setCartItems(JSON.parse(event.newValue));
      }

      if (event.key === ORDERS_STORAGE_KEY && event.newValue) {
        setOrders(parseStoredOrders(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.productId === item.productId);
      if (existingItem) {
        return prevItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevItems, item];
    });
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const addOrder = (order: Order) => {
    setOrders((prevOrders) => [order, ...prevOrders]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        orders,
        addOrder,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
