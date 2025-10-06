
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface POSOrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  modifiers?: Record<string, any>;
}

interface POSOrder {
  items: POSOrderItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  tip_amount: number;
  total_amount: number;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  table_id?: string;
  customer_name?: string;
  customer_phone?: string;
}

interface POSStore {
  // Current order state
  currentOrder: POSOrder | null;
  selectedCategory: string | null;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  activeTable: any;
  
  // Shift and register state
  currentShift: any;
  currentRegister: any;
  
  // Actions
  setSelectedCategory: (categoryId: string | null) => void;
  setOrderType: (type: 'dine_in' | 'takeaway' | 'delivery') => void;
  setActiveTable: (table: any) => void;
  
  // Cart operations
  addToCart: (item: Omit<POSOrderItem, 'total_price'>) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  
  // Order calculations
  calculateTotals: () => void;
  
  // Order management
  createNewOrder: () => void;
  
  // Shift management
  setCurrentShift: (shift: any) => void;
  setCurrentRegister: (register: any) => void;
}

export const usePOSStore = create<POSStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentOrder: null,
      selectedCategory: null,
      orderType: 'dine_in',
      activeTable: null,
      currentShift: null,
      currentRegister: null,

      // Category and filters
      setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
      
      setOrderType: (type) => set({ orderType: type }),
      
      setActiveTable: (table) => set({ activeTable: table }),

      // Cart operations
      addToCart: (item) => {
        const state = get();
        const currentOrder = state.currentOrder || {
          items: [],
          subtotal: 0,
          tax_amount: 0,
          discount_amount: 0,
          tip_amount: 0,
          total_amount: 0,
          order_type: state.orderType
        };

        // Check if item already exists
        const existingIndex = currentOrder.items.findIndex(
          orderItem => orderItem.product_id === item.product_id &&
          JSON.stringify(orderItem.modifiers) === JSON.stringify(item.modifiers)
        );

        let newItems;
        if (existingIndex >= 0) {
          // Update existing item
          newItems = [...currentOrder.items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + item.quantity,
            total_price: (newItems[existingIndex].quantity + item.quantity) * item.unit_price
          };
        } else {
          // Add new item
          newItems = [...currentOrder.items, {
            ...item,
            total_price: item.quantity * item.unit_price
          }];
        }

        const updatedOrder = { ...currentOrder, items: newItems };
        get().calculateTotals();
        
        set({ currentOrder: updatedOrder });
      },

      updateItemQuantity: (index, quantity) => {
        const state = get();
        if (!state.currentOrder) return;

        if (quantity <= 0) {
          get().removeFromCart(index);
          return;
        }

        const newItems = [...state.currentOrder.items];
        newItems[index] = {
          ...newItems[index],
          quantity,
          total_price: quantity * newItems[index].unit_price
        };

        const updatedOrder = { ...state.currentOrder, items: newItems };
        set({ currentOrder: updatedOrder });
        get().calculateTotals();
      },

      removeFromCart: (index) => {
        const state = get();
        if (!state.currentOrder) return;

        const newItems = state.currentOrder.items.filter((_, i) => i !== index);
        const updatedOrder = { ...state.currentOrder, items: newItems };
        
        if (newItems.length === 0) {
          set({ currentOrder: null });
        } else {
          set({ currentOrder: updatedOrder });
          get().calculateTotals();
        }
      },

      clearCart: () => set({ currentOrder: null }),

      getItemQuantity: (productId) => {
        const state = get();
        if (!state.currentOrder) return 0;
        
        return state.currentOrder.items
          .filter(item => item.product_id === productId)
          .reduce((total, item) => total + item.quantity, 0);
      },

      calculateTotals: () => {
        const state = get();
        if (!state.currentOrder) return;

        const subtotal = state.currentOrder.items.reduce(
          (sum, item) => sum + item.total_price, 0
        );
        
        // Simple tax calculation (10%)
        const tax_amount = subtotal * 0.1;
        const total_amount = subtotal + tax_amount - (state.currentOrder.discount_amount || 0);

        set({
          currentOrder: {
            ...state.currentOrder,
            subtotal,
            tax_amount,
            total_amount
          }
        });
      },

      createNewOrder: () => {
        const state = get();
        set({
          currentOrder: {
            items: [],
            subtotal: 0,
            tax_amount: 0,
            discount_amount: 0,
            tip_amount: 0,
            total_amount: 0,
            order_type: state.orderType
          }
        });
      },

      // Shift management
      setCurrentShift: (shift) => set({ currentShift: shift }),
      setCurrentRegister: (register) => set({ currentRegister: register }),
    }),
    {
      name: 'pos-store',
      partialize: (state) => ({
        currentOrder: state.currentOrder,
        orderType: state.orderType,
        currentShift: state.currentShift,
        currentRegister: state.currentRegister
      })
    }
  )
);
