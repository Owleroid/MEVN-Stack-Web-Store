<template>
  <div v-if="!translationsLoading" class="flex min-h-screen">
    <!-- Sidebar Navigation -->
    <aside
      :class="[
        'bg-gray-900 text-white flex flex-col shadow-xl transition-all duration-300',
        isSidebarCollapsed ? 'w-20' : 'w-64',
      ]"
    >
      <!-- Logo/Brand Area -->
      <div
        class="p-5 border-b border-gray-800 flex justify-between items-center"
      >
        <h1
          :class="[
            'font-bold transition-opacity duration-300',
            isSidebarCollapsed
              ? 'opacity-0 w-0 text-[0px]'
              : 'opacity-100 text-xl',
          ]"
        >
          Admin Panel
        </h1>
        <button
          @click="toggleSidebar"
          class="text-gray-400 hover:text-white transition-colors p-1 rounded-md focus:outline-none"
          :title="
            isSidebarCollapsed ? $t('expandSidebar') : $t('collapseSidebar')
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            :class="{ 'rotate-180': isSidebarCollapsed }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 py-4 overflow-y-auto">
        <ul class="space-y-1 px-3">
          <li v-for="(item, index) in navItems" :key="index">
            <router-link
              :to="item.path"
              :class="[
                'flex items-center rounded-md text-sm font-medium transition-colors',
                isSidebarCollapsed ? 'justify-center py-3 px-2' : 'py-3 px-4',
                'hover:bg-gray-800 group',
              ]"
              active-class="bg-blue-700 text-white"
              :title="isSidebarCollapsed ? item.label : ''"
            >
              <span
                class="inline-block w-5 h-5"
                :class="{ 'mr-3': !isSidebarCollapsed }"
              >
                <component :is="item.icon" class="w-5 h-5" />
              </span>
              <span
                :class="{
                  'opacity-0 w-0 absolute': isSidebarCollapsed,
                  'opacity-100': !isSidebarCollapsed,
                }"
              >
                {{ item.label }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Bottom Section -->
      <div class="p-4 border-t border-gray-800">
        <router-link
          to="/"
          :class="[
            'flex items-center rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors w-full',
            isSidebarCollapsed
              ? 'justify-center py-2 px-2'
              : 'justify-center py-2 px-4',
          ]"
          :title="$t('home')"
        >
          <span
            class="inline-block w-4 h-4"
            :class="{ 'mr-2': !isSidebarCollapsed }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7 7-7m-14 0l2-2"
              />
            </svg>
          </span>
          <span
            :class="{
              'opacity-0 w-0 absolute': isSidebarCollapsed,
              'opacity-100': !isSidebarCollapsed,
            }"
          >
            {{ $t("home") }}
          </span>
        </router-link>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 bg-gray-100 overflow-x-auto">
      <slot></slot>
    </div>
  </div>

  <!-- Loading state -->
  <div
    v-else
    class="bg-gray-900 text-white p-6 min-h-screen flex items-center justify-center"
  >
    <div class="flex items-center space-x-2">
      <svg
        class="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Loading translations...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { translationsLoaded } from "@/i18n";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const translationsLoading = computed(() => !translationsLoaded.value);
const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

// Icons components as simple SVG elements
const CategoryIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      }),
    ]
  );

const ProductIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      }),
    ]
  );

const DiscountIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      }),
    ]
  );

const WarehouseIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
      }),
    ]
  );

const OrderIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
      }),
    ]
  );

const ImageIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      }),
    ]
  );

const ClientIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      }),
    ]
  );

const SupportIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
      }),
    ]
  );

const AnnouncementIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
      }),
    ]
  );

const NewsIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "h-5 w-5",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      }),
    ]
  );

import { h } from "vue";

// Navigation items
const navItems = computed(() => [
  {
    path: "/admin/categories",
    label: t("categories"),
    icon: CategoryIcon,
  },
  {
    path: "/admin/products",
    label: t("products"),
    icon: ProductIcon,
  },
  {
    path: "/admin/discounts",
    label: t("discounts"),
    icon: DiscountIcon,
  },
  {
    path: "/admin/warehouse",
    label: t("warehouse"),
    icon: WarehouseIcon,
  },
  {
    path: "/admin/orders",
    label: t("orders"),
    icon: OrderIcon,
  },
  {
    path: "/admin/image-manager",
    label: t("imageManager"),
    icon: ImageIcon,
  },
  {
    path: "/admin/clients",
    label: t("clients"),
    icon: ClientIcon,
  },
  {
    path: "/admin/support",
    label: t("supportMessages"),
    icon: SupportIcon,
  },
  {
    path: "/admin/announcements",
    label: t("announcements"),
    icon: AnnouncementIcon,
  },
  {
    path: "/admin/news",
    label: t("news"),
    icon: NewsIcon,
  },
]);
</script>
