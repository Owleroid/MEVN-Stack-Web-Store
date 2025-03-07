import type { Product } from "../types/products";

const CART_KEY = import.meta.env.VITE_CART_KEY;

export const getCart = (): Product[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: Product): void => {
  const cart = getCart();
  cart.push(product);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const removeFromCart = (productId: string): void => {
  let cart = getCart();
  cart = cart.filter((product) => product._id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};
