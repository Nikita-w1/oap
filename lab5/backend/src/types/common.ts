export interface ValidationDetail {
  field: string;
  message: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}
