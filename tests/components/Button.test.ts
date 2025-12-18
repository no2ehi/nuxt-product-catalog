/**
 * Button Component Tests
 *
 * Tests for the reusable Button component that supports:
 * - Multiple variants (primary, secondary, outline, ghost, danger, link)
 * - Multiple sizes (sm, md, lg, icon)
 * - Loading and disabled states
 * - Link rendering (href, to props)
 */

import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Button from "@/components/ui/Button.vue";

describe("Button Component", () => {
  // ═══════════════════════════════════════════════════════════════
  // Rendering Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Rendering", () => {
    it("should render correctly with slot content", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: {
          default: "Click me",
        },
      });

      expect(wrapper.text()).toContain("Click me");
    });

    it("should render as a button element by default", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Button" },
      });

      expect(wrapper.element.tagName).toBe("BUTTON");
    });

    it("should have default type='button'", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Button" },
      });

      expect(wrapper.attributes("type")).toBe("button");
    });

    it("should render icon-left slot", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: {
          default: "Save",
          "icon-left": '<span class="test-icon-left">←</span>',
        },
      });

      expect(wrapper.find(".test-icon-left").exists()).toBe(true);
    });

    it("should render icon-right slot", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: {
          default: "Next",
          "icon-right": '<span class="test-icon-right">→</span>',
        },
      });

      expect(wrapper.find(".test-icon-right").exists()).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Variant Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Variants", () => {
    it("should apply primary variant classes by default", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Primary" },
      });

      expect(wrapper.classes()).toContain("bg-blue-600");
      expect(wrapper.classes()).toContain("text-white");
    });

    it("should apply primary variant classes explicitly", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { variant: "primary" },
        slots: { default: "Primary" },
      });

      expect(wrapper.classes()).toContain("bg-blue-600");
    });

    it("should apply secondary variant classes", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { variant: "secondary" },
        slots: { default: "Secondary" },
      });

      expect(wrapper.classes()).toContain("bg-slate-100");
      expect(wrapper.classes()).toContain("text-slate-900");
    });

    it("should apply outline variant classes", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { variant: "outline" },
        slots: { default: "Outline" },
      });

      expect(wrapper.classes()).toContain("border");
      expect(wrapper.classes()).toContain("border-slate-300");
    });

    it("should apply ghost variant classes", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { variant: "ghost" },
        slots: { default: "Ghost" },
      });

      expect(wrapper.classes()).toContain("text-slate-900");
    });

    it("should apply danger variant classes", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { variant: "danger" },
        slots: { default: "Delete" },
      });

      expect(wrapper.classes()).toContain("bg-red-600");
      expect(wrapper.classes()).toContain("text-white");
    });

    it("should apply link variant classes", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { variant: "link" },
        slots: { default: "Link" },
      });

      expect(wrapper.classes()).toContain("text-blue-600");
      expect(wrapper.classes()).toContain("underline");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Size Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Sizes", () => {
    it("should apply medium size classes by default", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Medium" },
      });

      expect(wrapper.classes()).toContain("h-10");
      expect(wrapper.classes()).toContain("px-4");
    });

    it("should apply small size classes", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { size: "sm" },
        slots: { default: "Small" },
      });

      expect(wrapper.classes()).toContain("h-9");
      expect(wrapper.classes()).toContain("px-3");
    });

    it("should apply large size classes", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { size: "lg" },
        slots: { default: "Large" },
      });

      expect(wrapper.classes()).toContain("h-11");
      expect(wrapper.classes()).toContain("px-5");
    });

    it("should apply icon size classes", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { size: "icon" },
        slots: { default: "🔍" },
      });

      expect(wrapper.classes()).toContain("h-10");
      expect(wrapper.classes()).toContain("w-10");
      expect(wrapper.classes()).toContain("p-0");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Block Prop Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Block Prop", () => {
    it("should not have full width by default", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Button" },
      });

      expect(wrapper.classes()).not.toContain("w-full");
    });

    it("should apply full width when block is true", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { block: true },
        slots: { default: "Full Width" },
      });

      expect(wrapper.classes()).toContain("w-full");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Button Type Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Button Type", () => {
    it("should have type='button' by default", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Button" },
      });

      expect(wrapper.attributes("type")).toBe("button");
    });

    it("should have type='submit' when specified", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { type: "submit" },
        slots: { default: "Submit" },
      });

      expect(wrapper.attributes("type")).toBe("submit");
    });

    it("should have type='reset' when specified", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { type: "reset" },
        slots: { default: "Reset" },
      });

      expect(wrapper.attributes("type")).toBe("reset");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Disabled State Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Disabled State", () => {
    it("should not be disabled by default", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Button" },
      });

      expect(wrapper.attributes("disabled")).toBeUndefined();
      expect(wrapper.attributes("aria-disabled")).toBeUndefined();
    });

    it("should be disabled when disabled prop is true", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { disabled: true },
        slots: { default: "Disabled" },
      });

      expect(wrapper.attributes("disabled")).toBeDefined();
      expect(wrapper.attributes("aria-disabled")).toBe("true");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Loading State Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Loading State", () => {
    it("should not show spinner by default", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Button" },
      });

      expect(wrapper.find("svg").exists()).toBe(false);
      // aria-busy is either undefined or "false" when not loading
      expect(wrapper.attributes("aria-busy")).not.toBe("true");
    });

    it("should show spinner when loading", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { loading: true },
        slots: { default: "Loading..." },
      });

      expect(wrapper.find("svg").exists()).toBe(true);
      expect(wrapper.attributes("aria-busy")).toBe("true");
    });

    it("should be disabled when loading", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { loading: true },
        slots: { default: "Loading..." },
      });

      expect(wrapper.attributes("disabled")).toBeDefined();
    });

    it("should have cursor-progress class when loading", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { loading: true },
        slots: { default: "Loading..." },
      });

      expect(wrapper.classes()).toContain("cursor-progress");
    });

    it("should hide spinner icon from assistive technology", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { loading: true },
        slots: { default: "Loading..." },
      });

      const svg = wrapper.find("svg");
      expect(svg.attributes("aria-hidden")).toBe("true");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Link Behavior Tests (href prop)
  // ═══════════════════════════════════════════════════════════════

  describe("Link Behavior (href)", () => {
    it("should render as anchor when href is provided", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { href: "https://example.com" },
        slots: { default: "Link" },
      });

      expect(wrapper.element.tagName).toBe("A");
      expect(wrapper.attributes("href")).toBe("https://example.com");
    });

    it("should not have type attribute when rendered as anchor", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { href: "https://example.com" },
        slots: { default: "Link" },
      });

      expect(wrapper.attributes("type")).toBeUndefined();
    });

    it("should add rel attribute for external links", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { href: "https://external.com" },
        slots: { default: "External" },
      });

      expect(wrapper.attributes("rel")).toBe("noopener noreferrer");
    });

    it("should not add rel attribute for internal links", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { href: "/internal-page" },
        slots: { default: "Internal" },
      });

      expect(wrapper.attributes("rel")).toBeUndefined();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Accessibility Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Accessibility", () => {
    it("should have base focus classes", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Button" },
      });

      expect(wrapper.classes()).toContain("focus-visible:outline-none");
      expect(wrapper.classes()).toContain("focus-visible:ring-2");
    });

    it("should support aria attributes via v-bind", async () => {
      const wrapper = await mountSuspended(Button, {
        attrs: {
          "aria-label": "Close dialog",
        },
        slots: { default: "×" },
      });

      expect(wrapper.attributes("aria-label")).toBe("Close dialog");
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // Interaction Tests
  // ═══════════════════════════════════════════════════════════════

  describe("Interactions", () => {
    it("should be clickable when enabled", async () => {
      const wrapper = await mountSuspended(Button, {
        slots: { default: "Click" },
      });

      expect(wrapper.attributes("disabled")).toBeUndefined();
      await wrapper.trigger("click");
      expect(wrapper.exists()).toBe(true);
    });

    it("should have disabled attribute when disabled", async () => {
      const wrapper = await mountSuspended(Button, {
        props: { disabled: true },
        slots: { default: "Disabled" },
      });

      expect(wrapper.attributes("disabled")).toBeDefined();
    });
  });
});
