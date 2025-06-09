<template>
  <div
    class="bg-gradient-to-r from-[#191919] to-[#0E0E0E] min-h-screen text-gray-300 py-6"
  >
    <transition
      enter-active-class="transition-opacity duration-500 ease-in-out"
      leave-active-class="transition-opacity duration-500 ease-in-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      appear
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Order Summary -->
          <div class="md:col-span-1">
            <div class="relative p-[1px] mb-4">
              <!-- Gradient border -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
              ></div>

              <!-- Content with background -->
              <div class="relative bg-[#0E0E0E] p-4">
                <div class="px-4 py-3 border-b border-main-gray">
                  <h2
                    class="text-2xl font-bold font-oswald uppercase bg-gradient-to-b from-gray-100 to-gray-500 text-transparent bg-clip-text"
                  >
                    {{ $t("orderSummary") }}
                  </h2>
                </div>
                <div>
                  <transition-group
                    enter-active-class="transition-all duration-500 ease-in-out"
                    leave-active-class="transition-all duration-500 ease-in-out"
                    enter-from-class="opacity-0 -translate-x-2"
                    leave-to-class="opacity-0 -translate-x-2"
                    tag="ul"
                    class="divide-y divide-main-gray"
                  >
                    <li
                      v-for="item in cart"
                      :key="item.product._id"
                      class="px-4 py-3 hover:bg-gray-900 transition-colors duration-200"
                    >
                      <div class="flex justify-between">
                        <div class="flex-grow">
                          <p class="font-medium text-gray-300">
                            {{ item.product.name }}
                          </p>
                          <p class="text-sm text-gray-500">
                            {{ $t("quantity") }}: {{ item.quantity }}
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="font-medium text-gray-300">
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

                  <div class="relative py-3 px-4">
                    <div
                      class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-gray-500"
                    ></div>
                    <div class="flex justify-between">
                      <p class="text-xl font-oswald text-gray-500">
                        {{ $t("total") }}
                      </p>
                      <p class="text-xl font-medium font-oswald text-gray-300">
                        {{ formatPrice(totalPrice) }}
                      </p>
                    </div>
                  </div>

                  <transition
                    enter-active-class="transition-opacity duration-500 ease-in-out"
                    leave-active-class="transition-opacity duration-500 ease-in-out"
                    enter-from-class="opacity-0"
                    leave-to-class="opacity-0"
                  >
                    <div v-if="totalSavings > 0" class="relative py-3 px-4">
                      <div
                        class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-gray-500"
                      ></div>
                      <div class="flex justify-between">
                        <p class="text-sm font-medium text-green-500">
                          {{ $t("totalSavings") }}
                        </p>
                        <p class="text-sm font-medium text-green-500">
                          {{ formatPrice(totalSavings) }}
                        </p>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Information Form -->
          <div class="md:col-span-2">
            <div class="relative p-[1px]">
              <!-- Gradient border -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
              ></div>

              <!-- Content with background -->
              <div class="relative bg-[#0E0E0E] p-4">
                <div class="px-4 py-3 border-b border-main-gray">
                  <h2
                    class="text-2xl font-bold font-oswald uppercase bg-gradient-to-b from-gray-100 to-gray-500 text-transparent bg-clip-text"
                  >
                    {{ $t("deliveryInfo") }}
                  </h2>
                  <p class="mt-1 text-sm text-gray-400">
                    {{ $t("pleaseEnterDeliveryDetails") }}
                  </p>
                </div>
                <div class="px-4 py-6">
                  <form @submit.prevent="handleCheckout" class="space-y-5">
                    <!-- Recipient Information -->
                    <div class="border-b border-main-gray pb-5">
                      <h3
                        class="text-xl font-oswald uppercase text-gray-300 mb-3"
                      >
                        {{ $t("recipientInformation") }}
                      </h3>
                      <div
                        class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4"
                      >
                        <div class="group">
                          <label
                            for="name"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.name
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("name") }}
                            <span class="text-[#BA0913]">*</span>
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.name
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="recipient.name"
                                type="text"
                                id="name"
                                required
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('name', true)"
                                @blur="setFocus('name', false)"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="group">
                          <label
                            for="surname"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.surname
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("surname") }}
                            <span class="text-[#BA0913]">*</span>
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.surname
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="recipient.surname"
                                type="text"
                                id="surname"
                                required
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('surname', true)"
                                @blur="setFocus('surname', false)"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="group">
                          <label
                            for="phone"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.phone
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("phone") }}
                            <span class="text-[#BA0913]">*</span>
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.phone
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="recipient.phone"
                                type="tel"
                                id="phone"
                                required
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('phone', true)"
                                @blur="setFocus('phone', false)"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="group">
                          <label
                            for="email"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.email
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("email") }}
                            <span class="text-[#BA0913]">*</span>
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.email
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="recipient.email"
                                type="email"
                                id="email"
                                required
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('email', true)"
                                @blur="setFocus('email', false)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Shipping Address -->
                    <div class="border-b border-main-gray pb-5">
                      <h3
                        class="text-xl font-oswald uppercase text-gray-300 mb-3"
                      >
                        {{ $t("shippingAddress") }}
                      </h3>

                      <!-- Address Autocomplete -->
                      <div class="mb-4">
                        <label
                          for="addressAutocomplete"
                          class="block text-sm font-medium transition-colors duration-200"
                          :class="[
                            focusStates.searchAddress
                              ? 'text-[#BA0913]'
                              : 'text-gray-400 hover:text-gray-300',
                          ]"
                        >
                          {{ $t("searchAddress") }}
                          <span class="text-[#BA0913]">*</span>
                        </label>
                        <div class="relative p-[1px] mt-1">
                          <!-- Gradient border -->
                          <div
                            class="absolute inset-0 transition-colors duration-500 ease-in-out"
                            :class="[
                              focusStates.searchAddress
                                ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                            ]"
                          ></div>
                          <div class="relative bg-[#0E0E0E]">
                            <AddressAutocomplete
                              :placeholder="$t('enterAddress')"
                              @address-components="handleAddressSelect"
                              @focus="setFocus('searchAddress', true)"
                              @blur="setFocus('searchAddress', false)"
                            />
                          </div>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">
                          {{ $t("searchAddressHint") }}
                        </p>
                      </div>

                      <div
                        class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4"
                      >
                        <div class="group">
                          <label
                            for="country"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.country
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("country") }}
                            <span class="text-[#BA0913]">*</span>
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.country
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="shippingAddress.country"
                                type="text"
                                id="country"
                                required
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('country', true)"
                                @blur="setFocus('country', false)"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="group">
                          <label
                            for="city"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.city
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("city") }}
                            <span class="text-[#BA0913]">*</span>
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.city
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="shippingAddress.city"
                                type="text"
                                id="city"
                                required
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('city', true)"
                                @blur="setFocus('city', false)"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="group">
                          <label
                            for="street"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.street
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("street") }}
                            <span class="text-[#BA0913]">*</span>
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.street
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="shippingAddress.street"
                                type="text"
                                id="street"
                                required
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('street', true)"
                                @blur="setFocus('street', false)"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="group">
                          <label
                            for="buildingNumber"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.buildingNumber
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("buildingNumber") }}
                            <span class="text-[#BA0913]">*</span>
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.buildingNumber
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="shippingAddress.buildingNumber"
                                type="text"
                                id="buildingNumber"
                                required
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('buildingNumber', true)"
                                @blur="setFocus('buildingNumber', false)"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="group">
                          <label
                            for="apartment"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.apartment
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("apartment") }}
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.apartment
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="shippingAddress.apartment"
                                type="text"
                                id="apartment"
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('apartment', true)"
                                @blur="setFocus('apartment', false)"
                              />
                            </div>
                          </div>
                        </div>

                        <div class="group">
                          <label
                            for="postalCode"
                            class="block text-sm font-medium transition-colors duration-200"
                            :class="[
                              focusStates.postalCode
                                ? 'text-[#BA0913]'
                                : 'text-gray-400 group-hover:text-gray-300',
                            ]"
                          >
                            {{ $t("postalCode") }}
                            <span class="text-[#BA0913]">*</span>
                          </label>
                          <div class="relative p-[1px] mt-1">
                            <!-- Gradient border -->
                            <div
                              class="absolute inset-0 transition-colors duration-500 ease-in-out"
                              :class="[
                                focusStates.postalCode
                                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                              ]"
                            ></div>
                            <div class="relative bg-[#0E0E0E]">
                              <input
                                v-model="shippingAddress.postalCode"
                                type="text"
                                id="postalCode"
                                required
                                class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                                @focus="setFocus('postalCode', true)"
                                @blur="setFocus('postalCode', false)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Order Notes -->
                    <div class="pb-5">
                      <div class="group">
                        <label
                          for="orderNotes"
                          class="block text-sm font-medium transition-colors duration-200"
                          :class="[
                            focusStates.orderNotes
                              ? 'text-[#BA0913]'
                              : 'text-gray-400 group-hover:text-gray-300',
                          ]"
                        >
                          {{ $t("orderNotes") }}
                        </label>
                        <div class="relative p-[1px] mt-1">
                          <!-- Gradient border -->
                          <div
                            class="absolute inset-0 transition-colors duration-500 ease-in-out"
                            :class="[
                              focusStates.orderNotes
                                ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                                : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
                            ]"
                          ></div>
                          <div class="relative bg-[#0E0E0E]">
                            <textarea
                              v-model="orderNotes"
                              id="orderNotes"
                              rows="3"
                              class="block w-full shadow-sm text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
                              placeholder="Add any special instructions or notes about your order here..."
                              @focus="setFocus('orderNotes', true)"
                              @blur="setFocus('orderNotes', false)"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col items-center space-y-3 pt-2">
                      <transition
                        enter-active-class="transition-opacity duration-500 ease-in-out"
                        leave-active-class="transition-opacity duration-500 ease-in-out"
                        enter-from-class="opacity-0"
                        leave-to-class="opacity-0"
                      >
                        <button
                          type="submit"
                          :disabled="!isPhoneValid"
                          class="h-[48px] px-12 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] hover:from-[#D20A15] hover:to-[#7A020D] transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {{ $t("placeOrder") }}
                        </button>
                      </transition>
                      <transition
                        enter-active-class="transition-opacity duration-500 ease-in-out"
                        leave-active-class="transition-opacity duration-500 ease-in-out"
                        enter-from-class="opacity-0"
                        leave-to-class="opacity-0"
                      >
                        <button
                          type="button"
                          @click="router.push('/cart')"
                          class="h-[48px] px-12 uppercase font-semibold text-white border border-main-gray hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
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
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

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

// Focus states for inputs
const focusStates = reactive({
  name: false,
  surname: false,
  phone: false,
  email: false,
  country: false,
  city: false,
  street: false,
  buildingNumber: false,
  apartment: false,
  postalCode: false,
  orderNotes: false,
  searchAddress: false,
});

// Set focus state
const setFocus = (field: string, value: boolean) => {
  focusStates[field as keyof typeof focusStates] = value;
};

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

// Phone always considered valid since we removed validation
const isPhoneValid = ref<boolean>(true);

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

  // Phone validation removed

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
