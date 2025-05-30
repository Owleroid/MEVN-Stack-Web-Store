<template>
  <div>
    <input
      ref="inputRef"
      type="text"
      :placeholder="placeholder"
      class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md px-4 py-3"
      @blur="handleBlur"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

interface PlaceResult {
  address_components?: google.maps.GeocoderAddressComponent[];
  formatted_address?: string;
  geometry?: google.maps.places.PlaceGeometry;
  place_id?: string;
  name?: string;
}

interface AddressData {
  country?: string;
  city?: string;
  street?: string;
  buildingNumber?: string;
  postalCode?: string;
}

const props = defineProps({
  placeholder: {
    type: String,
    default: "Enter a location",
  },
  initialValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["place-selected", "address-components"]);

const inputRef = ref<HTMLInputElement | null>(null);

const handleBlur = () => {
  if (inputRef.value && !inputRef.value.value) {
    emit("place-selected", null);
  }
};

onMounted(() => {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error("Google Maps API is not loaded yet");
    return;
  }

  if (!inputRef.value) return;

  if (props.initialValue) {
    inputRef.value.value = props.initialValue;
  }

  const autocomplete = new (google.maps.places as any).Autocomplete(
    inputRef.value,
    {
      types: ["address"],
      fields: [
        "place_id",
        "geometry",
        "name",
        "address_components",
        "formatted_address",
      ],
    }
  );

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace() as PlaceResult;

    if (!place.address_components) {
      console.error("No address components found");
      return;
    }

    const addressData: AddressData = {};

    place.address_components?.forEach((component) => {
      const types = component.types;

      if (types.includes("country")) {
        addressData.country = component.long_name;
      }

      if (
        types.includes("locality") ||
        types.includes("administrative_area_level_2")
      ) {
        addressData.city = component.long_name;
      }

      if (types.includes("route")) {
        addressData.street = component.long_name;
      }

      if (types.includes("street_number")) {
        addressData.buildingNumber = component.long_name;
      }

      if (types.includes("postal_code")) {
        addressData.postalCode = component.long_name;
      }
    });

    emit("place-selected", place);
    emit("address-components", addressData);
  });
});
</script>
