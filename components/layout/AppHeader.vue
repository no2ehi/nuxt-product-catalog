<template>
  <header class="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
    <NuxtLink
      to="/"
      class="text-2xl font-bold text-blue-600 transition-colors hover:text-blue-700"
      aria-label="Product Catalog - Go to homepage"
    >
      Product Catalog
    </NuxtLink>
    <nav aria-label="Main navigation">
      <ul class="flex items-center gap-6" role="list">
        <li>
          <NuxtLink
            to="/"
            class="font-medium text-gray-700 transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            active-class="text-blue-600 font-semibold"
            exact
          >
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/products/create"
            class="font-medium text-gray-700 transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            active-class="text-blue-600 font-semibold"
          >
            Create Product
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
