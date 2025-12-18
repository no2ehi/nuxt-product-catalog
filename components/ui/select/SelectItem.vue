<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useSlots, watchEffect } from "vue";
import { useSelectContext } from "./context";

const props = defineProps<{
  value: string | number;
  disabled?: boolean;
  label?: string;
}>();

const ctx = useSelectContext("SelectItem");
const itemRef = ref<HTMLElement | null>(null);
const labelRef = ref<HTMLElement | null>(null);
const slots = useSlots();

const currentLabel = ref<string>(props.label || String(props.value));

const getLabel = (): string => {
  // Use prop label if provided
  if (props.label) {
    return props.label;
  }

  // Try to get text from DOM element (most reliable)
  if (labelRef.value) {
    const text = labelRef.value.textContent?.trim();
    if (text) {
      return text;
    }
  }

  // Fallback: try to extract from slots
  const slotContent = slots.default?.();
  if (slotContent && slotContent.length > 0) {
    // Extract text from VNode children recursively
    const extractText = (node: unknown): string => {
      if (typeof node === "string" || typeof node === "number") {
        return String(node);
      }

      if (typeof node === "object" && node !== null && "children" in node) {
        const children = (node as { children?: unknown | unknown[] }).children;

        if (Array.isArray(children)) {
          return children.map(extractText).join("");
        }

        if (children !== undefined) {
          return extractText(children);
        }
      }

      return "";
    };
    const text = slotContent.map(extractText).join("").trim();
    if (text) {
      return text;
    }
  }

  return String(props.value);
};

// Update label when DOM is ready or props change
watchEffect(() => {
  nextTick(() => {
    const label = getLabel();
    if (currentLabel.value !== label) {
      currentLabel.value = label;
    }
    // Register/update option with current label
    ctx.registerOption(
      { value: props.value, label: currentLabel.value, disabled: props.disabled },
      itemRef.value
    );
  });
});

onMounted(() => {
  nextTick(() => {
    currentLabel.value = getLabel();
    ctx.registerOption(
      { value: props.value, label: currentLabel.value, disabled: props.disabled },
      itemRef.value
    );
  });
});

onUnmounted(() => {
  ctx.unregisterOption(props.value);
});

const isSelected = computed(() => ctx.selectedValue.value === props.value);
const isHighlighted = computed(() => ctx.highlightedValue.value === props.value);

const onClick = () => {
  if (props.disabled) return;
  ctx.selectValue(props.value);
};

const onMouseenter = () => {
  if (props.disabled) return;
  ctx.highlightValue(props.value);
};
</script>

<template>
  <div
    ref="itemRef"
    role="option"
    :data-select-value="value"
    :aria-selected="isSelected"
    :data-state="isSelected ? 'checked' : 'unchecked'"
    :class="[
      'relative flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none',
      props.disabled ? 'pointer-events-none opacity-40' : 'cursor-pointer',
      isHighlighted ? 'bg-slate-100 text-slate-900' : 'text-slate-900',
      isSelected ? 'font-medium' : 'font-normal',
    ]"
    @click="onClick"
    @mouseenter="onMouseenter"
  >
    <span ref="labelRef" class="flex-1 truncate">
      <slot />
    </span>
  </div>
</template>
