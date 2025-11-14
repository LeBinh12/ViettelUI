export interface FAQ {
  question: string;
  answer: string;
}

export interface SimilarPackage {
  id: string;
  name: string;
  data: string;
  price: number;
}

export interface ProviderInfo {
  company: string;
  address: string;
  hotline: string;
  website: string;
}

export interface ServicePackageDetail {
  id: string;                     // id trùng với ServicePackage
  package_name: string;           // tên gói
  price: number;                  // cước phí
  duration_months: number;        // thời gian gói
  description: string;            // mô tả giới thiệu
  data_info: string;              // ví dụ: "6GB/ngày (180GB/tháng)"
  syntax_register: string;        // cú pháp SMS
  // terms: string[];                // điều kiện áp dụng
  benefits: string[];             // các ưu đãi
  // questions: FAQ[];               // câu hỏi thường gặp
  similar_packages: SimilarPackage[]; // gói tương tự
  provider_info: ProviderInfo;
}
