declare interface Window {
  google: {
    maps: {
      places: {
        Autocomplete: new (
          inputField: HTMLInputElement,
          options?: {
            types?: string[];
            fields?: string[];
          }
        ) => google.maps.places.Autocomplete;
        PlaceGeometry: any;
      };
      GeocoderAddressComponent: {
        long_name: string;
        short_name: string;
        types: string[];
      };
    };
  };
}

declare namespace google.maps {
  namespace places {
    class Autocomplete {
      addListener(event: string, callback: () => void): void;
      getPlace(): any;
    }
    interface PlaceGeometry {
      location: any;
      viewport: any;
    }
  }

  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }
}
