<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ $t("userDetails.title") }}</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body" v-if="user">
        <div class="user-details-grid">
          <div class="detail-group">
            <h3>{{ $t("userDetails.basicInfo") }}</h3>
            <div class="detail-row">
              <span class="label">{{ $t("userDetails.name") }}:</span>
              <span class="value">{{ formatName(user) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ $t("userDetails.email") }}:</span>
              <span class="value">{{ user.email }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ $t("userDetails.phone") }}:</span>
              <span class="value">{{
                user.phone || $t("userDetails.notProvided")
              }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ $t("userDetails.role") }}:</span>
              <span class="value">
                <span :class="user.isAdmin ? 'admin-badge' : 'user-badge'">
                  {{
                    user.isAdmin
                      ? $t("userDetails.admin")
                      : $t("userDetails.user")
                  }}
                </span>
              </span>
            </div>
            <div class="detail-row">
              <span class="label"
                >{{ $t("userDetails.registrationDate") }}:</span
              >
              <span class="value">{{ formatDate(user.registrationDate) }}</span>
            </div>
          </div>

          <div class="detail-group" v-if="hasDeliveryData">
            <h3>{{ $t("userDetails.deliveryInfo") }}</h3>
            <div class="detail-row" v-if="user.deliveryData?.country">
              <span class="label">{{ $t("userDetails.country") }}:</span>
              <span class="value">{{ user.deliveryData.country }}</span>
            </div>
            <div class="detail-row" v-if="user.deliveryData?.city">
              <span class="label">{{ $t("userDetails.city") }}:</span>
              <span class="value">{{ user.deliveryData.city }}</span>
            </div>
            <div class="detail-row" v-if="user.deliveryData?.street">
              <span class="label">{{ $t("userDetails.street") }}:</span>
              <span class="value">{{ user.deliveryData.street }}</span>
            </div>
            <div class="detail-row" v-if="user.deliveryData?.buildingNumber">
              <span class="label">{{ $t("userDetails.buildingNumber") }}:</span>
              <span class="value">{{ user.deliveryData.buildingNumber }}</span>
            </div>
            <div class="detail-row" v-if="user.deliveryData?.apartment">
              <span class="label">{{ $t("userDetails.apartment") }}:</span>
              <span class="value">{{ user.deliveryData.apartment }}</span>
            </div>
            <div class="detail-row" v-if="user.deliveryData?.postalCode">
              <span class="label">{{ $t("userDetails.postalCode") }}:</span>
              <span class="value">{{ user.deliveryData.postalCode }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="close-btn" @click="closeModal">
          {{ $t("userDetails.close") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

interface DeliveryData {
  country?: string;
  city?: string;
  street?: string;
  buildingNumber?: string;
  apartment?: string;
  postalCode?: string;
}

interface User {
  _id: string;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  registrationDate: string;
  isAdmin?: boolean;
  deliveryData?: DeliveryData;
}

const props = defineProps<{
  show: boolean;
  user: User | null;
}>();

const emits = defineEmits(["close"]);

const closeModal = () => {
  emits("close");
};

const formatName = (user: User): string => {
  if (user.name && user.surname) {
    return `${user.name} ${user.surname}`;
  } else if (user.name) {
    return user.name;
  } else if (user.surname) {
    return user.surname;
  } else {
    return t("userDetails.noName");
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) return t("userDetails.notProvided");

  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale.value === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const hasDeliveryData = computed(() => {
  const data = props.user?.deliveryData;
  return (
    data &&
    (data.country ||
      data.city ||
      data.street ||
      data.buildingNumber ||
      data.apartment ||
      data.postalCode)
  );
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #a0aec0;
  transition: color 0.2s;
}

.close-button:hover {
  color: #718096;
}

.modal-body {
  padding: 1.5rem;
}

.user-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.detail-group {
  background-color: #f7fafc;
  border-radius: 0.375rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.detail-group h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #4a5568;
  font-size: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.detail-row {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: 600;
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.value {
  color: #2d3748;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  padding: 0.5rem 1rem;
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #cbd5e0;
}

.admin-badge,
.user-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.admin-badge {
  background-color: #ed8936;
  color: white;
}

.user-badge {
  background-color: #4299e1;
  color: white;
}

@media (min-width: 640px) {
  .detail-row {
    flex-direction: row;
    align-items: center;
  }

  .label {
    width: 40%;
    margin-bottom: 0;
  }

  .value {
    width: 60%;
  }
}
</style>
