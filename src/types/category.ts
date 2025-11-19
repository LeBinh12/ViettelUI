export interface Category {
  id: string;
  category_name: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  description: string;
}

export interface GetAllCategoryResponse {
  message: string;
  succeeded: boolean;
  data: CategoryDTO[];
  code: number;
}