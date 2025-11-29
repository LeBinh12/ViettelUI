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

export interface AddCategoryRequest {
  name: string,
  description: string
}

export interface UpdateCategoryRequest {
  id: string
  name: string,
  description: string
}

export interface CategoryResponse {
  message: string;
  succeeded: boolean;
  data: CategoryDTO;
  code: number;
}

export interface DeleteCategoryResponse {
  message: string;
  succeeded: boolean;
  data: boolean;
  code: number;
}