<template>
  <div class="checkout-page">
    <h1>{{ $t("checkoutView.checkout") }}</h1>

    <!-- Order Summary -->
    <div class="order-summary">
      <h2>{{ $t("checkoutView.orderSummary") }}</h2>
      <ul>
        <li v-for="item in cart" :key="item.product._id">
          <p>
            {{ item.product.name }} - {{ item.product.price[currency].amount }}
            {{ currency === "euros" ? "€" : "₽" }} x {{ item.quantity }}
          </p>
        </li>
      </ul>
      <p>
        {{ $t("checkoutView.total") }}: {{ totalPrice }}
        {{ currency === "euros" ? "€" : "₽" }}
      </p>
    </div>

    <!-- Delivery Information Form -->
    <div>
      <!-- <div v-if="!isAuthenticated"> -->
      <h2>{{ $t("checkoutView.deliveryInfo") }}</h2>
      <form @submit.prevent="handleCheckout">
        <div>
          <label for="name">{{ $t("checkoutView.name") }}</label>
          <input v-model="recipient.name" type="text" id="name" required />
        </div>
        <div>
          <label for="surname">{{ $t("checkoutView.surname") }}</label>
          <input
            v-model="recipient.surname"
            type="text"
            id="surname"
            required
          />
        </div>
        <div>
          <label for="phone">{{ $t("checkoutView.phone") }}</label>
          <input v-model="recipient.phone" type="tel" id="phone" required />
        </div>
        <div>
          <label for="email">{{ $t("checkoutView.email") }}</label>
          <input v-model="recipient.email" type="email" id="email" required />
        </div>
        <div>
          <label for="country">{{ $t("checkoutView.country") }}</label>
          <input
            v-model="shippingAddress.country"
            type="text"
            id="country"
            required
          />
        </div>
        <div>
          <label for="city">{{ $t("checkoutView.city") }}</label>
          <input
            v-model="shippingAddress.city"
            type="text"
            id="city"
            required
          />
        </div>
        <div>
          <label for="street">{{ $t("checkoutView.street") }}</label>
          <input
            v-model="shippingAddress.street"
            type="text"
            id="street"
            required
          />
        </div>
        <div>
          <label for="buildingNumber">{{
            $t("checkoutView.buildingNumber")
          }}</label>
          <input
            v-model="shippingAddress.buildingNumber"
            type="text"
            id="buildingNumber"
            required
          />
        </div>
        <div>
          <label for="apartment">{{ $t("checkoutView.apartment") }}</label>
          <input
            v-model="shippingAddress.apartment"
            type="text"
            id="apartment"
          />
        </div>
        <div>
          <label for="postalCode">{{ $t("checkoutView.postalCode") }}</label>
          <input
            v-model="shippingAddress.postalCode"
            type="text"
            id="postalCode"
            required
          />
        </div>
        <button type="submit">{{ $t("checkoutView.placeOrder") }}</button>
      </form>
    </div>
    <!-- <div v-else>
            <h2>{{ $t('checkoutView.confirmOrder') }}</h2>
            <p>{{ $t('checkoutView.deliveryInfoFromProfile') }}</p>
            <button @click="handleCheckout">{{ $t('checkoutView.placeOrder') }}</button>
        </div> -->
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import type { CartItem } from "@/types/cart";
import type { OrderData, Recipient, Address } from "@/types/orders";

import { useEventBus } from "@/utils/eventBus";

import { checkEmail, getUserData } from "@/services/authService";
import { createOrder } from "@/services/orderService";
import { getCart, clearCart } from "@/services/cartService";

import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();
const toast = useToast();
const { emit } = useEventBus();

const isAuthenticated = authStore.isAuthenticated;

const recipient = ref<Recipient>({
  name: "",
  surname: "",
  phone: "",
  email: "",
});

const shippingAddress = ref<Address>({
  country: "",
  city: "",
  street: "",
  buildingNumber: "",
  apartment: "",
  postalCode: "",
});

const cart = ref<CartItem[]>([]);
const totalPrice = ref(0);
const currency = ref<"rubles" | "euros">("euros");

onMounted(async () => {
  cart.value = getCart();
  totalPrice.value = cart.value.reduce(
    (total, item) =>
      total + item.product.price[currency.value].amount * item.quantity,
    0
  );
  currency.value =
    (sessionStorage.getItem("currency") as "rubles" | "euros") || "euros";

  // Retrieve form data from local storage if available
  const savedRecipient = localStorage.getItem("recipient");
  const savedShippingAddress = localStorage.getItem("shippingAddress");
  if (savedRecipient) {
    Object.assign(recipient.value, JSON.parse(savedRecipient));
  }
  if (savedShippingAddress) {
    Object.assign(shippingAddress.value, JSON.parse(savedShippingAddress));
  }

  // If user is authenticated, fetch user data from backend and pre-fill the form
  if (isAuthenticated) {
    try {
      const userData = await getUserData(authStore.userId);
      recipient.value.name = userData.name || "";
      recipient.value.surname = userData.surname || "";
      recipient.value.phone = userData.phone || "";
      recipient.value.email = userData.email || "";
      shippingAddress.value.country = userData.deliveryData?.country || "";
      shippingAddress.value.city = userData.deliveryData?.city || "";
      shippingAddress.value.street = userData.deliveryData?.street || "";
      shippingAddress.value.buildingNumber =
        userData.deliveryData?.buildingNumber || "";
      shippingAddress.value.apartment = userData.deliveryData?.apartment || "";
      shippingAddress.value.postalCode =
        userData.deliveryData?.postalCode || "";
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(
        "An error occurred while fetching user data. Please try again."
      );
    }
  }
});

const handleCheckout = async () => {
  if (!isAuthenticated) {
    try {
      const { exists } = await checkEmail(recipient.value.email);

      if (exists) {
        alert("Email is already registered. Please log in to continue.");

        // Save form data to local storage
        localStorage.setItem("recipient", JSON.stringify(recipient.value));
        localStorage.setItem(
          "shippingAddress",
          JSON.stringify(shippingAddress.value)
        );

        router.push("/login");
        return;
      }
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error(
        "An error occurred while checking the email. Please try again."
      );
      return;
    }
  }

  const orderData: OrderData = {
    userId: isAuthenticated ? authStore.userId : null,
    products: cart.value.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      amount: item.quantity,
      productPrice: item.product.price[currency.value].amount, // Use the appropriate price based on the currency
    })),
    totalPrice: totalPrice.value,
    currency: currency.value,
    shippingAddress: shippingAddress.value,
    recipient: recipient.value,
    status: "waiting confirmation",
    checked: false,
  };

  try {
    await createOrder(orderData);
    clearCart();
    localStorage.removeItem("recipient");
    localStorage.removeItem("shippingAddress");
    emit("cart-updated");
    router.push("/categories");
    toast.success("Order placed successfully!");
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error(
      "An error occurred while creating the order. Please try again."
    );
  }
};
</script>

<style scoped>
.checkout-page {
  padding: 20px;
}

.order-summary {
  margin-bottom: 20px;
}

.order-summary ul {
  list-style: none;
  padding: 0;
}

.order-summary li {
  margin-bottom: 10px;
}

form div {
  margin-bottom: 10px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input,
form select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
