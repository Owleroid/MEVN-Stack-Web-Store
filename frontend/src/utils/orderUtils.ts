import type { OrderStatus } from "@/types/orders";

export const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case "waiting confirmation":
      return "bg-yellow-100 text-yellow-800";
    case "packing":
      return "bg-blue-100 text-blue-800";
    case "sended":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
