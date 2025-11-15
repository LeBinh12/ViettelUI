export interface ServicePackage {
  id: string;
  package_name: string;
  price: number;
  duration_months: number;
  create_date: string;
  update_date: string;
  category_id?: string; 
}
