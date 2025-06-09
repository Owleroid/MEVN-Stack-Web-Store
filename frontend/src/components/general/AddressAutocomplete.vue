<template>
  <div>
    <input
      ref="inputRef"
      type="text"
      :placeholder="placeholder"
      class="block w-full text-sm bg-[#0E0E0E] text-gray-300 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
      @blur="handleBlur"
      @focus="handleFocus"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

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

const emit = defineEmits([
  "place-selected",
  "address-components",
  "focus",
  "blur",
]);

const inputRef = ref<HTMLInputElement | null>(null);

const handleBlur = () => {
  if (inputRef.value && !inputRef.value.value) {
    emit("place-selected", null);
  }
  emit("blur");
};

const handleFocus = () => {
  emit("focus");
};

// Function to inject custom CSS for the autocomplete dropdown
const injectAutocompleteStyles = () => {
  const styleElement = document.createElement("style");
  styleElement.id = "google-autocomplete-styles";
  styleElement.innerHTML = `
    /* Dark theme for Google Places Autocomplete */
    .pac-container {
      background-color: #0E0E0E !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4) !important;
      border-radius: 0 !important;
      margin-top: 1px !important;
      font-family: inherit !important;
    }
    
    .pac-item {
      padding: 8px 12px !important;
      border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
      cursor: pointer !important;
      background-color: #0E0E0E !important;
      color: #d1d5db !important;
    }
    
    .pac-item:hover, .pac-item.pac-item-selected {
      background-color: #191919 !important;
    }
    
    .pac-icon {
      filter: invert(0.8) brightness(0.8) sepia(1) saturate(5) hue-rotate(325deg) !important;
      opacity: 0.9 !important;
    }
    
    .pac-item-query {
      color: #f3f4f6 !important;
      font-size: 14px !important;
    }
    
    .pac-matched {
      color: #f3f4f6 !important;
      font-weight: bold !important;
    }
    
    .pac-item .pac-item-query + span {
      color: #9ca3af !important;
    }
    
    /* Add gradient border effect similar to our inputs */
    .pac-container:after {
      display: none !important;
    }
    
    .pac-container:before {
      content: "" !important;
      position: absolute !important;
      inset: -1px !important;
      background: linear-gradient(to bottom right, white, rgba(255, 255, 255, 0.5), transparent) !important;
      opacity: 0.8 !important;
      z-index: -1 !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(styleElement);
  return styleElement;
};

let styleElement: HTMLStyleElement | null = null;

onMounted(() => {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error("Google Maps API is not loaded yet");
    return;
  }

  if (!inputRef.value) return;

  if (props.initialValue) {
    inputRef.value.value = props.initialValue;
  }

  // Add custom styles for the autocomplete dropdown
  styleElement = injectAutocompleteStyles();

  // Force browser geolocation detection to be ignored and use English
  const options = {
    types: ["address"],
    fields: [
      "place_id",
      "geometry",
      "name",
      "address_components",
      "formatted_address",
    ],
    language: "en",
  };

  const autocomplete = new (google.maps.places as any).Autocomplete(
    inputRef.value,
    options
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

// Clean up the injected styles when component is unmounted
onBeforeUnmount(() => {
  if (styleElement) {
    document.head.removeChild(styleElement);
    styleElement = null;
  }
});
</script>
