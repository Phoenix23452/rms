
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface POSAuthStore {
  currentStaff: any;
  isAuthenticated: boolean;
  
  // Actions
  login: (staff: any) => void;
  logout: () => void;
  
  // Permissions
  canAccessManager: () => boolean;
  canAccessAdmin: () => boolean;
  canVoidOrders: () => boolean;
  canApplyDiscounts: () => boolean;
}

export const usePOSAuth = create<POSAuthStore>()(
  persist(
    (set, get) => ({
      currentStaff: null,
      isAuthenticated: false,

      login: (staff) => set({ 
        currentStaff: staff, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        currentStaff: null, 
        isAuthenticated: false 
      }),

      canAccessManager: () => {
        const { currentStaff } = get();
        return currentStaff?.role === 'manager' || currentStaff?.role === 'admin';
      },

      canAccessAdmin: () => {
        const { currentStaff } = get();
        return currentStaff?.role === 'admin';
      },

      canVoidOrders: () => {
        const { currentStaff } = get();
        return currentStaff?.role === 'manager' || currentStaff?.role === 'admin';
      },

      canApplyDiscounts: () => {
        const { currentStaff } = get();
        return currentStaff?.role !== 'cashier';
      }
    }),
    {
      name: 'pos-auth-store',
      partialize: (state) => ({
        currentStaff: state.currentStaff,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
