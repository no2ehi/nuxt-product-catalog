<script setup lang="ts">
import { useSelectContext } from "./context";

useSelectContext("SelectGroup");
</script>

<template>
  <div role="group" class="py-1">
    <slot />
  </div>
</template>
