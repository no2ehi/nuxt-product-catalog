<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from "vue";
import { SELECT_KEY, type Option, type SelectContext, type SelectSize } from "./context";

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    size?: SelectSize;
    block?: boolean;
  }>(),
  {
    placeholder: "Select an option",
    disabled: false,
    invalid: false,
    size: "md",
    block: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
  (e: "change", value: string | number | null): void;
  (e: "open-change", value: boolean): void;
}>();

const open = ref(false);
const selectedValue = ref<string | number | null>(props.modelValue ?? null);
const highlightedValue = ref<string | number | null>(null);
const options = reactive<Array<Option & { el: HTMLElement | null }>>([]);

const triggerEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);

const placeholder = computed(() => props.placeholder);
const disabled = computed(() => props.disabled);
const invalid = computed(() => props.invalid);
const size = computed(() => props.size);
const block = computed(() => props.block);

watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val ?? null;
  }
);

const selectedLabel = computed(() => {
  const match = options.find((opt) => opt.value === selectedValue.value);
  return match?.label ?? "";
});

const registerOption = (option: Option, el: HTMLElement | null) => {
  const exists = options.find((opt) => opt.value === option.value);
  if (!exists) {
    options.push({ ...option, el });
  } else {
    exists.label = option.label;
    exists.disabled = option.disabled;
    exists.el = el;
  }
};

const unregisterOption = (value: string | number) => {
  const idx = options.findIndex((opt) => opt.value === value);
  if (idx !== -1) options.splice(idx, 1);
};

const scrollHighlightedIntoView = () => {
  if (!contentEl.value || highlightedValue.value === null) return;
  const el = contentEl.value.querySelector<HTMLElement>(
    `[data-select-value="${highlightedValue.value}"]`
  );
  if (el) {
    el.scrollIntoView({ block: "nearest" });
  }
};

const closeSelect = (focusTrigger = false) => {
  open.value = false;
  emit("open-change", false);
  if (focusTrigger && triggerEl.value) {
    triggerEl.value.focus();
  }
};

const openSelect = () => {
  if (disabled.value) return;
  open.value = true;
  emit("open-change", true);
  nextTick(scrollHighlightedIntoView);
};

const toggle = () => {
  if (open.value) {
    closeSelect(true);
  } else {
    openSelect();
  }
};

const selectValue = (value: string | number | null) => {
  if (disabled.value) return;
  selectedValue.value = value;
  emit("update:modelValue", value);
  emit("change", value);
  closeSelect(true);
};

const highlightNext = () => {
  if (!options.length) return;
  const enabled = options.filter((opt) => !opt.disabled);
  if (!enabled.length) return;
  const currentIdx = enabled.findIndex((opt) => opt.value === highlightedValue.value);
  const next = enabled[(currentIdx + 1 + enabled.length) % enabled.length];
  highlightedValue.value = next?.value ?? enabled[0].value;
  nextTick(scrollHighlightedIntoView);
};

const highlightPrev = () => {
  if (!options.length) return;
  const enabled = options.filter((opt) => !opt.disabled);
  if (!enabled.length) return;
  const currentIdx = enabled.findIndex((opt) => opt.value === highlightedValue.value);
  const prev = enabled[(currentIdx - 1 + enabled.length) % enabled.length];
  highlightedValue.value = prev?.value ?? enabled[0].value;
  nextTick(scrollHighlightedIntoView);
};

const highlightValue = (value: string | number | null) => {
  highlightedValue.value = value;
};

let typeaheadBuffer = "";
let typeaheadTimeout: number | undefined;

const typeahead = (char: string) => {
  typeaheadBuffer += char.toLowerCase();
  clearTimeout(typeaheadTimeout);
  typeaheadTimeout = window.setTimeout(() => {
    typeaheadBuffer = "";
  }, 500);

  const match = options.find(
    (opt) => !opt.disabled && opt.label.toLowerCase().startsWith(typeaheadBuffer)
  );
  if (match) {
    highlightedValue.value = match.value;
    nextTick(scrollHighlightedIntoView);
  }
};

const onDocumentClick = (event: MouseEvent) => {
  if (!open.value) return;
  const target = event.target as Node;
  if (triggerEl.value?.contains(target) || contentEl.value?.contains(target)) {
    return;
  }
  closeSelect();
};

const onEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && open.value) {
    event.stopPropagation();
    closeSelect(true);
  }
};

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentClick);
  document.addEventListener("keydown", onEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentClick);
  document.removeEventListener("keydown", onEscape);
});

const context: SelectContext = {
  open,
  disabled,
  invalid,
  size,
  block,
  placeholder,
  selectedValue,
  selectedLabel,
  highlightedValue,
  registerOption,
  unregisterOption,
  selectValue,
  toggle,
  openSelect,
  closeSelect,
  highlightNext,
  highlightPrev,
  highlightValue,
  typeahead,
  triggerEl,
  contentEl,
};

provide(SELECT_KEY, context);
</script>

<template>
  <div class="relative inline-block" :class="block ? 'w-full' : ''">
    <slot />
  </div>
</template>
