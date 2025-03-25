import type { Product } from "@/types/products";
import type { CartItem } from "@/types/cart";

const CART_KEY = import.meta.env.VITE_CART_KEY;

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: Product): void => {
  const cart = getCart();
  const existingItem = cart.find((item) => item.product._id === product._id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const removeFromCart = (productId: string): void => {
  let cart = getCart();
  cart = cart.filter((item) => item.product._id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const updateCartQuantity = (
  productId: string,
  quantity: number
): void => {
  const cart = getCart();
  const item = cart.find((item) => item.product._id === productId);

  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};
