// composables/useProducts.ts
import { computed } from "vue";
import { useSWR } from "~/composables/useSWR.composable";

import { productsService } from "~/services/product.service";

import type { Product, ProductResponseParams } from "~/types/product.type";

export const useProducts = () => {
  const service = productsService();

  const list = (params?: ProductResponseParams) =>
    useSWR({
      key: computed(() => `products-${JSON.stringify(params)}`),
      fetcher: () => service.list(params),
    });

  const get = (id: number) =>
    useSWR({
      key: `product-${id}`,
      fetcher: () => service.get(id),
    });

  const create = (payload: Partial<Product>) => service.create(payload);
  const update = (id: number, payload: Partial<Product>) => service.update(id, payload);
  const remove = (id: number) => service.delete(id);

  const categories = () =>
    useSWR({
      key: "product-categories",
      fetcher: () => service.categories(),
    });

  const categoryList = () =>
    useSWR({
      key: "product-category-list",
      fetcher: () => service.categoryList(),
    });

  const getByCategory = (category: string) =>
    useSWR({
      key: `products-category-${category}`,
      fetcher: () => service.getByCategory(category),
    });

  const search = (q: string) =>
    useSWR({
      key: computed(() => `products-search-${q}`),
      fetcher: () => service.search(q),
    });

  return {
    list,
    get,
    create,
    update,
    remove,
    categories,
    categoryList,
    getByCategory,
    search,
  };
};
