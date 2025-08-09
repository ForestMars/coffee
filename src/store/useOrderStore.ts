import { create } from 'zustand';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface OrderState {
  cart: CartItem[];
  orders: Order[];
  showPaymentModal: boolean;
  showNotification: boolean;

  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  setShowPaymentModal: (open: boolean) => void;
  setShowNotification: (show: boolean) => void;

  loadFromStorage: () => void;
  saveCartToStorage: () => void;

  processPayment: () => Order | null;
  loadOrders: () => void;
  updateOrderStatus: (orderId: number, newStatus: Order['status']) => void;
  deleteOrder: (orderId: number) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  cart: [],
  orders: [],
  showPaymentModal: false,
  showNotification: false,

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((ci) =>
            ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),

  removeFromCart: (itemId) =>
    set((state) => {
      const existingItem = state.cart.find((ci) => ci.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return {
          cart: state.cart.map((ci) =>
            ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
          ),
        };
      }
      return { cart: state.cart.filter((ci) => ci.id !== itemId) };
    }),

  clearCart: () => set({ cart: [] }),

  getTotalPrice: () => get().cart.reduce((t, i) => t + i.price * i.quantity, 0),

  setShowPaymentModal: (open) => set({ showPaymentModal: open }),
  setShowNotification: (show) => set({ showNotification: show }),

  loadFromStorage: () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[];
        set({ cart: parsed });
      }
    } catch {
      // ignore
    }
  },

  saveCartToStorage: () => {
    try {
      const { cart } = get();
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  },

  processPayment: () => {
    const state = get();
    if (state.cart.length === 0) return null;
    const newOrder: Order = {
      id: Date.now(),
      items: state.cart.map((c) => ({ ...c })),
      total: state.cart.reduce((t, i) => t + i.price * i.quantity, 0),
      date: new Date().toISOString(),
      status: 'pending',
    };

    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
      const updatedOrders = [...orders, newOrder];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      set({ cart: [] });
      localStorage.removeItem('cart');
      return newOrder;
    } catch {
      return null;
    }
  },

  loadOrders: () => {
    try {
      const saved = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
      set({ orders: saved });
    } catch {
      set({ orders: [] });
    }
  },

  updateOrderStatus: (orderId, newStatus) =>
    set((state) => {
      const updated = state.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem('orders', JSON.stringify(updated));
      return { orders: updated };
    }),

  deleteOrder: (orderId) =>
    set((state) => {
      const updated = state.orders.filter((o) => o.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updated));
      return { orders: updated };
    }),
}));


