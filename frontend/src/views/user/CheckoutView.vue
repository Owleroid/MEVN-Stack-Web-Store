<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Order Summary -->
      <div class="md:col-span-1">
        <div class="bg-white shadow overflow-hidden rounded-lg">
          <div class="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 class="text-lg font-medium text-gray-900">
              {{ $t("orderSummary") }}
            </h2>
          </div>
          <div class="border-t border-gray-200">
            <ul class="divide-y divide-gray-200">
              <li
                v-for="item in cart"
                :key="item.product._id"
                class="px-4 py-4 sm:px-6"
              >
                <div class="flex justify-between">
                  <div class="flex-grow">
                    <p class="font-medium">{{ item.product.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{ $t("quantity") }}: {{ item.quantity }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium">
                      {{
                        formatPrice(
                          item.product.price[currency] * item.quantity
                        )
                      }}
                    </p>
                    <p
                      v-if="item.product.discount"
                      class="text-sm line-through text-gray-500"
                    >
                      {{
                        formatPrice(
                          item.product.discount.originalPrice[currency] *
                            item.quantity
                        )
                      }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <div class="bg-gray-50 px-4 py-5 sm:px-6 flex justify-between">
              <p class="font-semibold text-gray-900">{{ $t("total") }}</p>
              <p class="font-semibold text-gray-900">
                {{ formatPrice(totalPrice) }}
              </p>
            </div>
            <div
              v-if="totalSavings > 0"
              class="bg-gray-50 px-4 py-2 sm:px-6 flex justify-between border-t"
            >
              <p class="text-sm font-medium text-green-600">
                {{ $t("totalSavings") }}
              </p>
              <p class="text-sm font-medium text-green-600">
                {{ formatPrice(totalSavings) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Information Form -->
      <div class="md:col-span-2">
        <div class="bg-white shadow overflow-hidden rounded-lg">
          <div class="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 class="text-lg font-medium text-gray-900">
              {{ $t("deliveryInfo") }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ $t("pleaseEnterDeliveryDetails") }}
            </p>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <form @submit.prevent="handleCheckout">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <!-- Recipient Information -->
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("name") }} *
                  </label>
                  <input
                    v-model="recipient.name"
                    type="text"
                    id="name"
                    required
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    for="surname"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("surname") }} *
                  </label>
                  <input
                    v-model="recipient.surname"
                    type="text"
                    id="surname"
                    required
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  />
                </div>

                <div class="transition-all duration-300">
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("phone") }} *
                  </label>
                  <vue-tel-input
                    v-model="recipient.phone"
                    :inputOptions="{ id: 'phone', required: true }"
                    :dropdownOptions="{
                      showDialCodeInSelection: true,
                      showFlags: true,
                      showSearchBox: true,
                    }"
                    mode="international"
                    :validCharactersOnly="true"
                    autoFormat
                    @validate="validatePhone"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm text-base border-gray-300 rounded-md"
                  ></vue-tel-input>
                  <transition name="fade">
                    <p v-if="phoneError" class="mt-1 text-xs text-red-600">
                      {{ phoneError }}
                    </p>
                  </transition>
                </div>

                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("email") }} *
                  </label>
                  <input
                    v-model="recipient.email"
                    type="email"
                    id="email"
                    required
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  />
                </div>

                <!-- Shipping Address -->
                <div class="col-span-full mt-4 border-t pt-4">
                  <h3 class="text-md font-medium text-gray-900 mb-4">
                    {{ $t("shippingAddress") }}
                  </h3>
                </div>

                <!-- Address Autocomplete -->
                <div class="col-span-full">
                  <label
                    for="addressAutocomplete"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("searchAddress") }} *
                  </label>
                  <AddressAutocomplete
                    :placeholder="$t('enterAddress')"
                    @address-components="handleAddressSelect"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    {{ $t("searchAddressHint") }}
                  </p>
                </div>

                <div>
                  <label
                    for="country"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("country") }} *
                  </label>
                  <input
                    v-model="shippingAddress.country"
                    type="text"
                    id="country"
                    required
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    for="city"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("city") }} *
                  </label>
                  <input
                    v-model="shippingAddress.city"
                    type="text"
                    id="city"
                    required
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    for="street"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("street") }} *
                  </label>
                  <input
                    v-model="shippingAddress.street"
                    type="text"
                    id="street"
                    required
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    for="buildingNumber"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("buildingNumber") }} *
                  </label>
                  <input
                    v-model="shippingAddress.buildingNumber"
                    type="text"
                    id="buildingNumber"
                    required
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    for="apartment"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("apartment") }}
                  </label>
                  <input
                    v-model="shippingAddress.apartment"
                    type="text"
                    id="apartment"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  />
                </div>

                <div>
                  <label
                    for="postalCode"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("postalCode") }} *
                  </label>
                  <input
                    v-model="shippingAddress.postalCode"
                    type="text"
                    id="postalCode"
                    required
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  />
                </div>

                <div class="col-span-full mt-4 border-t pt-4">
                  <label
                    for="orderNotes"
                    class="block text-sm font-medium text-gray-700"
                  >
                    {{ $t("orderNotes") }}
                  </label>
                  <textarea
                    v-model="orderNotes"
                    id="orderNotes"
                    rows="3"
                    class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
                  ></textarea>
                </div>
              </div>

              <div class="mt-8 flex flex-col space-y-4">
                <button
                  type="submit"
                  :disabled="!isPhoneValid"
                  class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {{ $t("placeOrder") }}
                </button>
                <button
                  type="button"
                  @click="router.push('/cart')"
                  class="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {{ $t("backToCart") }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

import type { CartItem } from "@/types/cart";
import type {
  ClientOrderData,
  Recipient,
  Address,
  Currency,
} from "@/types/orders";

import { useEventBus } from "@/utils/eventBus";

import { checkEmail, getUserData } from "@/services/authService";
import { createOrder } from "@/services/orderService";
import { getCart, clearCart, refreshCartItems } from "@/services/cartService";

import { useAuthStore } from "@/stores/authStore";
import AddressAutocomplete from "@/components/general/AddressAutocomplete.vue";

// Composables Setup
const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();
const toast = useToast();
const { emit } = useEventBus();

// State Management
const isAuthenticated = computed(() => authStore.isAuthenticated);
const cart = ref<CartItem[]>([]);
const orderNotes = ref<string>("");
const currency = ref<Currency>("euros");

// Form Data
const recipient = ref<Recipient>({
  name: "",
  surname: "",
  phone: "",
  email: "",
});

// Phone validation
const isPhoneValid = ref<boolean>(false);
const phoneError = ref<string>("");

const validatePhone = (validation: {
  valid: boolean;
  number: string;
  country: any;
}) => {
  isPhoneValid.value = validation.valid;
  if (!validation.valid) {
    phoneError.value = t("invalidPhoneNumber");
  } else {
    phoneError.value = "";
    recipient.value.phone = validation.number;
  }
};

const shippingAddress = ref<Address>({
  country: "",
  city: "",
  street: "",
  buildingNumber: "",
  apartment: "",
  postalCode: "",
});

// Computed Properties
const totalPrice = computed<number>(() => {
  return cart.value.reduce(
    (total, item) => total + item.product.price[currency.value] * item.quantity,
    0
  );
});

const totalSavings = computed<number>(() => {
  return cart.value.reduce(
    (total, item) =>
      total +
      (item.product.discount
        ? item.product.discount.originalPrice[currency.value] -
          item.product.price[currency.value]
        : 0) *
        item.quantity,
    0
  );
});

// Utility Functions
const formatPrice = (price: number): string => {
  return currency.value === "rubles"
    ? new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(price)
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(price);
};

// Google Maps Address Handler
const handleAddressSelect = (addressData: Partial<Address>): void => {
  if (addressData.country) {
    shippingAddress.value.country = addressData.country;
  }

  if (addressData.city) {
    shippingAddress.value.city = addressData.city;
  }

  if (addressData.street) {
    shippingAddress.value.street = addressData.street;
  }

  if (addressData.buildingNumber) {
    shippingAddress.value.buildingNumber = addressData.buildingNumber;
  }

  if (addressData.postalCode) {
    shippingAddress.value.postalCode = addressData.postalCode;
  }
};

// Form Handling
const handleCheckout = async (): Promise<void> => {
  if (cart.value.length === 0) {
    toast.error(t("emptyCartError"));
    return;
  }

  if (!isPhoneValid.value) {
    toast.error(t("invalidPhoneNumber"));
    return;
  }

  if (!isAuthenticated.value) {
    try {
      const { exists } = await checkEmail(recipient.value.email);

      if (exists) {
        toast.error(t("emailAlreadyRegistered"));
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
      toast.error(t("checkEmailError"));
      return;
    }
  }

  const orderData: ClientOrderData = {
    userId: isAuthenticated.value ? authStore.userId : undefined,
    products: cart.value.map((item) => ({
      productId: item.product._id,
      amount: item.quantity,
    })),
    currency: currency.value,
    shippingAddress: shippingAddress.value,
    recipient: recipient.value,
    status: "waiting confirmation",
    checked: false,
    orderNotes: orderNotes.value || undefined,
  };

  try {
    await createOrder(orderData);
    clearCart();
    localStorage.removeItem("recipient");
    localStorage.removeItem("shippingAddress");
    emit("cart-updated");
    router.push("/orders");
    toast.success(t("orderSuccess"));
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error(t("orderError"));
  }
};

// Lifecycle Hooks
onMounted(async () => {
  cart.value = getCart();
  if (cart.value.length === 0) {
    toast.warning(t("emptyCart"));
    router.push("/cart");
    return;
  }

  try {
    cart.value = await refreshCartItems();
  } catch (error) {
    console.error("Failed to refresh cart items:", error);
    toast.error(t("cartRefreshError") || "Failed to refresh cart items");
  }

  currency.value = (sessionStorage.getItem("currency") as Currency) || "euros";

  const savedRecipient = localStorage.getItem("recipient");
  const savedShippingAddress = localStorage.getItem("shippingAddress");

  if (savedRecipient) {
    Object.assign(recipient.value, JSON.parse(savedRecipient));
  }

  if (savedShippingAddress) {
    Object.assign(shippingAddress.value, JSON.parse(savedShippingAddress));
  }

  if (isAuthenticated.value) {
    try {
      const userData = await getUserData(authStore.userId);

      recipient.value.name = userData.name || "";
      recipient.value.surname = userData.surname || "";
      recipient.value.phone = userData.phone || "";
      recipient.value.email = userData.email || "";

      if (userData.deliveryData) {
        shippingAddress.value.country = userData.deliveryData.country || "";
        shippingAddress.value.city = userData.deliveryData.city || "";
        shippingAddress.value.street = userData.deliveryData.street || "";
        shippingAddress.value.buildingNumber =
          userData.deliveryData.buildingNumber || "";
        shippingAddress.value.apartment = userData.deliveryData.apartment || "";
        shippingAddress.value.postalCode =
          userData.deliveryData.postalCode || "";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(t("fetchUserDataError"));
    }
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
