<script setup lang="ts">
import { computed, useSlots } from "vue";

type InputSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    type?: string;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    size?: InputSize;
    errorMessage?: string;
  }>(),
  {
    type: "text",
    disabled: false,
    readonly: false,
    invalid: false,
    size: "md",
    errorMessage: "",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
  (e: "input", event: Event): void;
  (e: "change", event: Event): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
}>();

const slots = useSlots();
const hasLeftSlot = computed(() => Boolean(slots["icon-left"] || slots.left));
const hasRightSlot = computed(() => Boolean(slots["icon-right"] || slots.right));

const sizeClasses: Record<InputSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-3 text-sm",
  lg: "h-11 px-4 text-base",
};

const baseClasses =
  "flex w-full rounded-md border bg-white text-slate-900 placeholder:text-slate-500 shadow-sm transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const ringClasses = computed(() =>
  props.invalid
    ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    : "border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
);

const paddingClasses = computed(() =>
  [hasLeftSlot.value ? "pl-10" : "", hasRightSlot.value ? "pr-10" : ""].filter(Boolean).join(" ")
);

const classes = computed(() =>
  [baseClasses, ringClasses.value, sizeClasses[props.size], paddingClasses.value]
    .filter(Boolean)
    .join(" ")
);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number | null = target.value;

  if (props.type === "number") {
    value = target.value === "" ? null : Number(target.value);
  }

  emit("update:modelValue", value);
  emit("input", event);
};

const onChange = (event: Event) => {
  emit("change", event);
};

const onBlur = (event: FocusEvent) => emit("blur", event);
const onFocus = (event: FocusEvent) => emit("focus", event);
</script>

<template>
  <div class="relative w-full">
    <span
      v-if="hasLeftSlot"
      class="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-slate-500"
      aria-hidden="true"
    >
      <slot name="icon-left" />
      <slot name="left" />
    </span>

    <input
      v-bind="$attrs"
      :type="type"
      :value="modelValue ?? ''"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="invalid || undefined"
      :aria-describedby="invalid && errorMessage ? `${$attrs.id}-error` : undefined"
      :class="classes"
      @input="onInput"
      @change="onChange"
      @blur="onBlur"
      @focus="onFocus"
    />

    <span
      v-if="hasRightSlot"
      class="absolute inset-y-0 right-3 inline-flex items-center text-slate-500"
    >
      <slot name="icon-right" />
      <slot name="right" />
    </span>

    <!-- Error message for screen readers -->
    <span v-if="invalid && errorMessage" :id="`${$attrs.id}-error`" class="sr-only" role="alert">
      {{ errorMessage }}
    </span>
  </div>
</template>
