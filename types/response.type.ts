import type { Pagination } from "./pagination.type";

export type ListResponse<T, K extends string = "items"> = Pagination & {
  [key in K]: T[];
};

export type SortOrder = "asc" | "desc";

export type SortBy = "price" | "rating";

export type SortParams = {
  sortBy?: SortBy;
  order?: SortOrder;
};
