import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'system', // Default to system theme
      setTheme: (newTheme) => set({ theme: newTheme }),
      toggleTheme: () => set((state) => {
        if (state.theme === 'system') return { theme: 'dark' };
        if (state.theme === 'dark') return { theme: 'light' };
        return { theme: 'system' };
      }),
      isCartOpen: false,
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      isMenuOpen: false,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      isUserMenuOpen: false,
      isUserMenuOpen: false,
      toggleUserMenu: () => set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
      toast: { message: null, type: 'info' },
      showToast: (message, type = 'info') => set({ toast: { message, type } }),
      hideToast: () => set({ toast: { message: null, type: 'info' } }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
