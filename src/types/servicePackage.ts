export interface ServicePackage {
  id: string;
  package_name: string;
  price: number;
  duration_months: number;
  create_date: string;
  update_date: string;
  category_id?: string;
}


export interface ServicePackageResponse {
  message: string,
  succeeded: boolean,
  data: ServicePackageDTO[],
  code: number,
}

export interface ServicePackageDTO {
  id: string,
  packageName: string,
  price: number,
  description: string,
  durationMonths: number,
  categoryName: string
}