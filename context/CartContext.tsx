'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type SubstitutionPreference = 'CALL_ME' | 'REPLACE_WITH_BEST' | 'CANCEL_ITEM';

export interface CartItem {
  productId: string;
  variationId: string;
  productName: string;
  variationTitle: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  imageUrl: string | null;
  stockQuantity: number;
  substitutionPreference: SubstitutionPreference;
}

export interface SelectedAddress {
  id: string;
  label: string;
  address_line_1: string;
  address_line_2?: string | null;
  landmark?: string | null;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity' | 'substitutionPreference'>, qty?: number) => void;
  removeItem: (variationId: string) => void;
  updateQuantity: (variationId: string, quantity: number) => void;
  setSubstitutionPreference: (variationId: string, pref: SubstitutionPreference) => void;
  clearCart: () => void;
  getItemQuantity: (variationId: string) => number;
  selectedAddress: SelectedAddress | null;
  setSelectedAddress: (addr: SelectedAddress | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'freshmart_cart_v1';
const ADDRESS_STORAGE_KEY = 'freshmart_address_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);

  // 1. Hydrate cart from localStorage on mount (Ephemeral State)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedAddr = localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (storedAddr) {
        setSelectedAddress(JSON.parse(storedAddr));
      } else {
        // Fallback default address for demo
        const defaultAddr: SelectedAddress = {
          id: 'addr_default_demo',
          label: 'Home',
          address_line_1: 'Flat 402, Tower B, Palm Grove Heights',
          address_line_2: 'Golf Course Road, Sector 54',
          landmark: 'Opposite Metro Station',
          city: 'Gurugram',
          pincode: '122002',
          latitude: 28.4595,
          longitude: 77.0266,
        };
        setSelectedAddress(defaultAddr);
      }
    } catch (err) {
      console.warn('Failed restoring cart from localStorage:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist to localStorage whenever cart changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        console.warn('Failed saving cart to localStorage:', err);
      }
    }
  }, [items, isHydrated]);

  useEffect(() => {
    if (isHydrated && selectedAddress) {
      try {
        localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(selectedAddress));
      } catch (err) {
        console.warn('Failed saving address to localStorage:', err);
      }
    }
  }, [selectedAddress, isHydrated]);

  // Calculations
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const getItemQuantity = (variationId: string): number => {
    const found = items.find((i) => i.variationId === variationId);
    return found ? found.quantity : 0;
  };

  const addItem = (
    newItem: Omit<CartItem, 'quantity' | 'substitutionPreference'>,
    qty = 1
  ) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variationId === newItem.variationId);
      if (existing) {
        const nextQty = Math.min(
          existing.quantity + qty,
          newItem.stockQuantity || 99
        );
        return prev.map((i) =>
          i.variationId === newItem.variationId ? { ...i, quantity: nextQty } : i
        );
      } else {
        return [
          ...prev,
          {
            ...newItem,
            quantity: Math.min(qty, newItem.stockQuantity || 99),
            substitutionPreference: 'REPLACE_WITH_BEST',
          },
        ];
      }
    });
  };

  const removeItem = (variationId: string) => {
    setItems((prev) => prev.filter((i) => i.variationId !== variationId));
  };

  const updateQuantity = (variationId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variationId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.variationId === variationId) {
          const clamped = Math.min(quantity, i.stockQuantity || 99);
          return { ...i, quantity: clamped };
        }
        return i;
      })
    );
  };

  const setSubstitutionPreference = (
    variationId: string,
    preference: SubstitutionPreference
  ) => {
    setItems((prev) =>
      prev.map((i) =>
        i.variationId === variationId
          ? { ...i, substitutionPreference: preference }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        setSubstitutionPreference,
        clearCart,
        getItemQuantity,
        selectedAddress,
        setSelectedAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
