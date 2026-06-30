import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartStoreItem = {
  productId: string;
  variantId?: string | null;
  name: string;
  slug: string;
  imageUrl?: string | null;
  size?: string | null;
  color?: string | null;
  price: number;
  quantity: number;
};

type CartStore = {
  items: CartStoreItem[];
  addItem: (item: CartStoreItem) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (
    productId: string,
    variantId: string | null | undefined,
    quantity: number,
  ) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) =>
              cartItem.productId === item.productId &&
              cartItem.variantId === item.variantId,
          );

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId &&
                cartItem.variantId === item.variantId
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + item.quantity,
                    }
                  : cartItem,
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId),
          ),
        })),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item) =>
                    !(
                      item.productId === productId &&
                      item.variantId === variantId
                    ),
                )
              : state.items.map((item) =>
                  item.productId === productId && item.variantId === variantId
                    ? { ...item, quantity }
                    : item,
                ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "decus-cart",
    },
  ),
);
