// src/store/cartStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Definícia položky v košíku
export interface CartItem {
  productId: string;
  variantId: string; // Jedinečné ID pre kombináciu veľkosť/farba (použijeme ID z `sizes` poľa)
  quantity: number;
  // Pridáme aj dáta pre zobrazenie v košíku
  title: string;
  color: string | null;
  size: string | null;
  sku?: string | null;
  price: number; // Cena za kus (s DPH)
  image?: string | null; // URL obrázka (variantu alebo produktu)
}

// Definícia stavu a akcií košíka
interface CartState {
  items: CartItem[];
  addItem: (itemToAdd: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, newQuantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number; // Funkcia na získanie celkového počtu kusov
  getCartTotal: () => number; // Funkcia na získanie celkovej ceny
}

// Vytvorenie store s perzistenciou do localStorage
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], // Počiatočný stav - prázdny košík

      // Akcia na pridanie položky (alebo zvýšenie množstva)
      addItem: (itemToAdd) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.variantId === itemToAdd.variantId
          );
          let updatedItems;

          if (existingItemIndex > -1) {
            // Položka už existuje, zvýšime množstvo
            updatedItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + itemToAdd.quantity } // Pripočítame nové množstvo
                : item
            );
          } else {
            // Položka neexistuje, pridáme ju do poľa
            updatedItems = [...state.items, itemToAdd];
          }
          console.log("Cart updated:", updatedItems); // Log pre debugovanie
          return { items: updatedItems };
        }),

      // Akcia na odstránenie položky
      removeItem: (variantIdToRemove) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.variantId !== variantIdToRemove
          ),
        })),

      // Akcia na aktualizáciu množstva konkrétnej položky
      updateQuantity: (variantIdToUpdate, newQuantity) =>
        set((state) => {
          // Zabezpečíme, že množstvo neklesne pod 1
          const validatedQuantity = Math.max(1, newQuantity);
          return {
            items: state.items.map((item) =>
              item.variantId === variantIdToUpdate
                ? { ...item, quantity: validatedQuantity }
                : item
            ),
          };
          // Ak by sme chceli odstrániť pri quantity 0:
          // if (newQuantity <= 0) {
          //   return { items: state.items.filter(item => item.variantId !== variantIdToUpdate) };
          // }
          // return { items: updatedItems };
        }),

      // Akcia na vyprázdnenie košíka
      clearCart: () => set({ items: [] }),

      // Selektor na získanie celkového počtu kusov
      getItemCount: () => {
        const { items } = get(); // Získame aktuálne položky
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      // Selektor na získanie celkovej ceny košíka
      getCartTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "shopping-cart-storage", // Názov kľúča v localStorage
      storage: createJSONStorage(() => localStorage), // Použijeme localStorage
      // Voliteľné: Čiastočná perzistencia (ak by si nechcel ukladať všetko)
      // partialize: (state) => ({ items: state.items }),
    }
  )
);
