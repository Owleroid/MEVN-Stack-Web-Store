<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <transition name="fade" appear>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Order Summary -->
        <div class="md:col-span-1">
          <div
            class="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div class="px-5 py-6 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ $t("orderSummary") }}
              </h2>
            </div>
            <div class="border-t border-gray-200">
              <transition-group
                name="list"
                tag="ul"
                class="divide-y divide-gray-200"
              >
                <li
                  v-for="item in cart"
                  :key="item.product._id"
                  class="px-5 py-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="flex justify-between">
                    <div class="flex-grow">
                      <p class="font-medium text-gray-800">
                        {{ item.product.name }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ $t("quantity") }}: {{ item.quantity }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-medium text-gray-800">
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
              </transition-group>
              <div
                class="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-6 flex justify-between"
              >
                <p class="font-semibold text-gray-900 text-lg">
                  {{ $t("total") }}
                </p>
                <p class="font-semibold text-gray-900 text-lg">
                  {{ formatPrice(totalPrice) }}
                </p>
              </div>
              <transition name="fade">
                <div
                  v-if="totalSavings > 0"
                  class="bg-green-50 px-5 py-3 flex justify-between border-t"
                >
                  <p class="text-sm font-medium text-green-600">
                    {{ $t("totalSavings") }}
                  </p>
                  <p class="text-sm font-medium text-green-600">
                    {{ formatPrice(totalSavings) }}
                  </p>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Delivery Information Form -->
        <div class="md:col-span-2">
          <div
            class="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div class="px-5 py-6 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ $t("deliveryInfo") }}
              </h2>
              <p class="mt-1 text-sm text-gray-600">
                {{ $t("pleaseEnterDeliveryDetails") }}
              </p>
            </div>
            <div class="px-5 py-6">
              <form @submit.prevent="handleCheckout" class="space-y-6">
                <!-- Recipient Information -->
                <div
                  class="bg-white p-5 rounded-lg border border-gray-100 shadow-sm"
                >
                  <h3 class="text-md font-semibold text-gray-800 mb-4">
                    {{ $t("recipientInformation") }}
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div class="group">
                      <label
                        for="name"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("name") }} *
                      </label>
                      <input
                        v-model="recipient.name"
                        type="text"
                        id="name"
                        required
                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      />
                    </div>

                    <div class="group">
                      <label
                        for="surname"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("surname") }} *
                      </label>
                      <input
                        v-model="recipient.surname"
                        type="text"
                        id="surname"
                        required
                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      />
                    </div>

                    <div class="group transition-all duration-300">
                      <label
                        for="phone"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("phone") }} *
                      </label>
                      <vue-tel-input
                        v-model="recipient.phone"
                        :inputOptions="{
                          id: 'phone',
                          required: true,
                          class: 'h-11 text-base',
                        }"
                        :dropdownOptions="{
                          showDialCodeInSelection: true,
                          showFlags: true,
                          showSearchBox: true,
                        }"
                        :inputClasses="'px-4 py-3'"
                        :wrapperClasses="'mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'"
                        mode="international"
                        :validCharactersOnly="true"
                        autoFormat
                        @validate="validatePhone"
                      ></vue-tel-input>
                      <transition name="fade">
                        <p v-if="phoneError" class="mt-1 text-xs text-red-600">
                          {{ phoneError }}
                        </p>
                      </transition>
                    </div>

                    <div class="group">
                      <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("email") }} *
                      </label>
                      <input
                        v-model="recipient.email"
                        type="email"
                        id="email"
                        required
                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <!-- Shipping Address -->
                <div
                  class="bg-white p-5 rounded-lg border border-gray-100 shadow-sm"
                >
                  <h3 class="text-md font-semibold text-gray-800 mb-4">
                    {{ $t("shippingAddress") }}
                  </h3>

                  <!-- Address Autocomplete -->
                  <div class="mb-4">
                    <label
                      for="addressAutocomplete"
                      class="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      {{ $t("searchAddress") }} *
                    </label>
                    <div class="mt-1 relative">
                      <AddressAutocomplete
                        class="shadow-sm"
                        :placeholder="$t('enterAddress')"
                        @address-components="handleAddressSelect"
                      />
                      <p class="mt-1 text-xs text-gray-500">
                        {{ $t("searchAddressHint") }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div class="group">
                      <label
                        for="country"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("country") }} *
                      </label>
                      <input
                        v-model="shippingAddress.country"
                        type="text"
                        id="country"
                        required
                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      />
                    </div>

                    <div class="group">
                      <label
                        for="city"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("city") }} *
                      </label>
                      <input
                        v-model="shippingAddress.city"
                        type="text"
                        id="city"
                        required
                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      />
                    </div>

                    <div class="group">
                      <label
                        for="street"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("street") }} *
                      </label>
                      <input
                        v-model="shippingAddress.street"
                        type="text"
                        id="street"
                        required
                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      />
                    </div>

                    <div class="group">
                      <label
                        for="buildingNumber"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("buildingNumber") }} *
                      </label>
                      <input
                        v-model="shippingAddress.buildingNumber"
                        type="text"
                        id="buildingNumber"
                        required
                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      />
                    </div>

                    <div class="group">
                      <label
                        for="apartment"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("apartment") }}
                      </label>
                      <input
                        v-model="shippingAddress.apartment"
                        type="text"
                        id="apartment"
                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      />
                    </div>

                    <div class="group">
                      <label
                        for="postalCode"
                        class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ $t("postalCode") }} *
                      </label>
                      <input
                        v-model="shippingAddress.postalCode"
                        type="text"
                        id="postalCode"
                        required
                        class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <!-- Order Notes -->
                <div
                  class="bg-white p-5 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div class="group">
                    <label
                      for="orderNotes"
                      class="block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
                    >
                      {{ $t("orderNotes") }}
                    </label>
                    <textarea
                      v-model="orderNotes"
                      id="orderNotes"
                      rows="3"
                      class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-lg px-4 py-3 transition-all duration-200"
                      placeholder="Add any special instructions or notes about your order here..."
                    ></textarea>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col space-y-4">
                  <transition name="scale">
                    <button
                      type="submit"
                      :disabled="!isPhoneValid"
                      class="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {{ $t("placeOrder") }}
                    </button>
                  </transition>
                  <transition name="scale">
                    <button
                      type="button"
                      @click="router.push('/cart')"
                      class="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {{ $t("backToCart") }}
                    </button>
                  </transition>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Additional styling for form elements focus state */
input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}
</style>
