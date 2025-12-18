/**
 * Unit Testing Tutorial
 *
 * This file demonstrates basic unit testing concepts with Vitest.
 * A unit test verifies that a single function or piece of code works correctly.
 */

import { describe, it, expect } from "vitest";

// ═══════════════════════════════════════════════════════════════
// Example 1: Testing a simple function
// ═══════════════════════════════════════════════════════════════

function sum(a: number, b: number): number {
  return a + b;
}

describe("sum function", () => {
  it("should add two positive numbers correctly", () => {
    expect(sum(2, 3)).toBe(5);
  });

  it("should work with negative numbers", () => {
    expect(sum(-1, 5)).toBe(4);
    expect(sum(-2, -3)).toBe(-5);
  });

  it("should work with zero", () => {
    expect(sum(0, 5)).toBe(5);
    expect(sum(0, 0)).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// Example 2: Testing more complex functions
// ═══════════════════════════════════════════════════════════════

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
}

function calculateFinalPrice(product: Product): number {
  if (product.discount) {
    return product.price * (1 - product.discount / 100);
  }
  return product.price;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

describe("Price functions", () => {
  describe("calculateFinalPrice", () => {
    it("should return original price when no discount", () => {
      const product: Product = { id: 1, name: "Shoes", price: 100000 };
      expect(calculateFinalPrice(product)).toBe(100000);
    });

    it("should calculate discount correctly", () => {
      const product: Product = { id: 1, name: "Shoes", price: 100000, discount: 20 };
      // 20% off 100000 = 80000
      expect(calculateFinalPrice(product)).toBe(80000);
    });

    it("should handle zero discount", () => {
      const product: Product = { id: 1, name: "Shoes", price: 100000, discount: 0 };
      expect(calculateFinalPrice(product)).toBe(100000);
    });
  });

  describe("formatPrice", () => {
    it("should format price with Persian locale", () => {
      expect(formatPrice(1000000)).toBe("۱٬۰۰۰٬۰۰۰ تومان");
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// Example 3: Common Matchers Reference
// ═══════════════════════════════════════════════════════════════

describe("Common Matchers Reference", () => {
  it("toBe - for primitive value comparison", () => {
    expect(2 + 2).toBe(4);
    expect("hello").toBe("hello");
  });

  it("toEqual - for object and array comparison", () => {
    expect({ name: "John" }).toEqual({ name: "John" });
    expect([1, 2, 3]).toEqual([1, 2, 3]);
  });

  it("toBeTruthy / toBeFalsy - for truthy/falsy checks", () => {
    expect(true).toBeTruthy();
    expect(1).toBeTruthy();
    expect("text").toBeTruthy();

    expect(false).toBeFalsy();
    expect(0).toBeFalsy();
    expect("").toBeFalsy();
    expect(null).toBeFalsy();
  });

  it("toContain - for checking item existence in array or string", () => {
    expect([1, 2, 3]).toContain(2);
    expect("Hello World").toContain("World");
  });

  it("toBeGreaterThan / toBeLessThan - for number comparison", () => {
    expect(10).toBeGreaterThan(5);
    expect(3).toBeLessThan(5);
    expect(10).toBeGreaterThanOrEqual(10);
  });

  it("toHaveLength - for array or string length", () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect("hello").toHaveLength(5);
  });

  it("toThrow - for testing error throwing", () => {
    const throwError = () => {
      throw new Error("Something went wrong!");
    };
    expect(throwError).toThrow();
    expect(throwError).toThrow("Something went wrong!");
  });

  it("toBeNull / toBeUndefined / toBeDefined", () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect("something").toBeDefined();
  });
});
