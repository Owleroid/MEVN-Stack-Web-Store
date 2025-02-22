import { ref } from "vue";

const eventBus = ref(new Map());

export const useEventBus = () => {
  const on = (event: string, callback: Function) => {
    if (!eventBus.value.has(event)) {
      eventBus.value.set(event, []);
    }
    eventBus.value.get(event).push(callback);
  };

  const emit = (event: string, data?: any) => {
    if (eventBus.value.has(event)) {
      eventBus.value.get(event).forEach((callback: Function) => callback(data));
    }
  };

  return { on, emit };
};
