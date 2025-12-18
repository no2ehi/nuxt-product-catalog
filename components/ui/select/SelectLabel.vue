<script setup lang="ts">
import { useSelectContext } from "./context";

useSelectContext("SelectLabel");
</script>

<template>
  <div class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
    <slot />
  </div>
</template>
