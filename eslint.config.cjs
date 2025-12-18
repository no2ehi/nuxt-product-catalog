const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  // Base JS recommended config
  js.configs.recommended,
  // Nuxt/Vue auto-imported globals
  {
    languageOptions: {
      globals: {
        // Nuxt config & composables
        defineNuxtConfig: "readonly",
        useRoute: "readonly",
        useRouter: "readonly",
        useAsyncData: "readonly",
        useRuntimeConfig: "readonly",
        $fetch: "readonly",
      },
    },
  },
  // Project-specific config translated from old .eslintrc.cjs (without extends)
  ...compat.config({
    env: {
      browser: true,
      node: true,
      es2022: true,
    },
    parser: "vue-eslint-parser",
    parserOptions: {
      parser: "@typescript-eslint/parser",
      ecmaVersion: 2022,
      sourceType: "module",
      ecmaFeatures: {
        jsx: false,
      },
    },
    plugins: ["@typescript-eslint", "vue", "prettier"],
    rules: {
      // Vue specific rules
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "warn",
      "vue/require-default-prop": "off",
      "vue/require-explicit-emits": "warn",
      "vue/html-self-closing": [
        "warn",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always",
          },
          svg: "always",
          math: "always",
        },
      ],

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // General rules
      "no-unused-vars": "off",
      "no-undef": "error",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "prefer-const": "warn",
      "no-var": "error",

      // Prettier integration
      "prettier/prettier": "warn",
    },
  }),
  // Ignore patterns
  {
    ignores: [".nuxt", ".output", ".nitro", "dist", "node_modules", "*.d.ts"],
  },
];
