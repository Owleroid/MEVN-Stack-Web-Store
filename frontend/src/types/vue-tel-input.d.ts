declare module "vue-tel-input" {
  import { Component } from "vue";

  export const VueTelInput: Component;

  export interface VueTelInputInstance {
    validate: () => { valid: boolean; number: string; country: any };
  }

  export default {
    install: (app: any, options?: any) => any,
  };
}
