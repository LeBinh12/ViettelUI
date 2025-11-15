export interface Package {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  descriptionn: string;
  category_id: string;
  category_name: string;
  status: "Đang bán" | "Ngừng bán";
}
