import type {
  Product,
  ProductCategory,
  ProductCategorySlugs,
  ProductResponseParams,
  ProductsResponse,
} from "~/types/product.type";

import { useApi } from "~/composables/useApi.composable";

import { HttpMethod } from "~/enums/HttpMethod.enum";

export const productsService = () => {
  const api = useApi();

  return {
    list: (params?: ProductResponseParams) => api<ProductsResponse>("/products", { params }),

    search: (q: string) => api<ProductsResponse>("/products/search", { params: { q } }),

    get: (id: number) => api<Product>(`/products/${id}`),

    create: (payload: Partial<Product>) =>
      api<Product>("/products/add", { method: HttpMethod.POST, body: payload }),

    update: (id: number, payload: Partial<Product>) =>
      api<Product>(`/products/${id}`, { method: HttpMethod.PUT, body: payload }),

    delete: (id: number) => api<Product>(`/products/${id}`, { method: HttpMethod.DELETE }),

    categories: () => api<ProductCategory[]>("/products/categories"),

    categoryList: () => api<ProductCategorySlugs>("/products/category-list"),

    getByCategory: (category: string) => api<ProductsResponse>(`/products/category/${category}`),
  };
};
