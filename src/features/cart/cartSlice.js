import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }
};

const initialState = loadState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
          totalPrice: newItem.price * (newItem.quantity || 1),
        });
      } else {
        const qtyToAdd = newItem.quantity || 1;
        existingItem.quantity += qtyToAdd;
        existingItem.totalPrice += newItem.price * qtyToAdd;
      }

      const qtyToAdd = newItem.quantity || 1;
      state.totalQuantity += qtyToAdd;
      state.totalAmount += newItem.price * qtyToAdd;

      // Save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(state));
      } catch (err) {
        console.warn("Failed to save cart to localStorage:", err);
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;

        state.items = state.items.filter(item => item.id !== id);

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += existingItem.price;
        state.totalQuantity++;
        state.totalAmount += existingItem.price;

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
      } else if (existingItem && existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
      }
      // Save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(state));
      } catch (err) {
        console.warn("Failed to save cart to localStorage:", err);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      // Save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(state));
      } catch (err) {
        console.warn("Failed to save cart to localStorage:", err);
      }
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
