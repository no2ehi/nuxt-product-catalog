<script setup lang="ts">
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";

type ButtonSize = "sm" | "md" | "lg" | "icon";

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
    to?: RouteLocationRaw;
    href?: string;
  }>(),
  {
    variant: "primary",
    size: "md",
    type: "button",
    disabled: false,
    loading: false,
    block: false,
  }
);

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  outline: "border border-slate-300 text-slate-900 hover:bg-slate-50",
  ghost: "text-slate-900 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  link: "text-blue-600 hover:text-blue-700 underline underline-offset-4",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

const componentTag = computed(() => (props.to ? "NuxtLink" : props.href ? "a" : "button"));

const rel = computed(() => (props.href?.startsWith("http") ? "noopener noreferrer" : undefined));

const classes = computed(() =>
  [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.block ? "w-full" : "",
    props.loading ? "cursor-progress" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <component
    :is="componentTag"
    :to="to"
    :href="href"
    :rel="rel"
    :type="componentTag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading ? 'true' : undefined"
    :aria-busy="loading"
    :class="classes"
    v-bind="$attrs"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin text-current"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
    </svg>

    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>
