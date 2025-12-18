import { inject } from "vue";
import type { ComputedRef, Ref } from "vue";

export type SelectSize = "sm" | "md" | "lg";

export type Option = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

export type SelectContext = {
  open: Ref<boolean>;
  disabled: ComputedRef<boolean>;
  invalid: ComputedRef<boolean>;
  size: ComputedRef<SelectSize>;
  block: ComputedRef<boolean>;
  placeholder: ComputedRef<string>;
  selectedValue: Ref<string | number | null>;
  selectedLabel: ComputedRef<string>;
  highlightedValue: Ref<string | number | null>;
  registerOption: (option: Option, el: HTMLElement | null) => void;
  unregisterOption: (value: string | number) => void;
  selectValue: (value: string | number | null) => void;
  toggle: () => void;
  openSelect: () => void;
  closeSelect: (focusTrigger?: boolean) => void;
  highlightNext: () => void;
  highlightPrev: () => void;
  highlightValue: (value: string | number | null) => void;
  typeahead: (char: string) => void;
  triggerEl: Ref<HTMLElement | null>;
  contentEl: Ref<HTMLElement | null>;
};

export const SELECT_KEY = Symbol("select");

export const useSelectContext = (component: string) => {
  const context = inject<SelectContext>(SELECT_KEY);
  if (!context) {
    throw new Error(`${component} must be used inside <Select>`);
  }
  return context;
};
