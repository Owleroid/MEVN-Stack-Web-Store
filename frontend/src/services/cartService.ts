import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/products";

const CART_KEY = import.meta.env.VITE_CART_KEY || "shopping_cart";

/**
 * Retrieves the current cart from localStorage
 * @returns Array of CartItem objects
 */
export const getCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    // If JSON parsing fails, return empty cart
    return [];
  }
};

/**
 * Adds a product to the cart
 * @param product - The product to add
 * @param quantity - Optional quantity to add (defaults to 1)
 */
export const addToCart = (product: Product, quantity: number = 1): void => {
  if (!product || !product._id) return;

  const cart = getCart();
  const existingItem = cart.find((item) => item.product._id === product._id);

  if (existingItem) {
    existingItem.quantity += Math.max(1, quantity);
  } else {
    cart.push({ product, quantity: Math.max(1, quantity) });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

/**
 * Removes a product from the cart
 * @param productId - ID of the product to remove
 */
export const removeFromCart = (productId: string): void => {
  if (!productId) return;

  let cart = getCart();
  cart = cart.filter((item) => item.product._id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

/**
 * Updates the quantity of a product in the cart
 * @param productId - ID of the product to update
 * @param quantity - New quantity
 */
export const updateCartQuantity = (
  productId: string,
  quantity: number
): void => {
  if (!productId) return;

  const cart = getCart();
  const item = cart.find((item) => item.product._id === productId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }
};

/**
 * Clears all items from the cart
 */
export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

/**
 * Gets the total number of items in the cart
 * @returns Total quantity of all items
 */
export const getCartItemsCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculates the total price of items in the cart
 * @returns Total price
 */
export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

/**
 * Checks if a product is already in the cart
 * @param productId - ID of the product to check
 * @returns Boolean indicating if product is in cart
 */
export const isInCart = (productId: string): boolean => {
  if (!productId) return false;

  const cart = getCart();
  return cart.some((item) => item.product._id === productId);
};
