export interface Pagination {
  total: number;
  skip: number;
  limit: number;
}

export interface PaginationParams {
  limit?: number;
  skip?: number;
}
