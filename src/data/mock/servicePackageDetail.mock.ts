import type { ServicePackageDetail } from "../../types/servicePackageDetail";

export const mockServicePackageDetails: ServicePackageDetail[] = [
  // --- GÓI WIFI ---
  {
    id: "pkg-001",
    package_name: "Gói Cơ Bản Internet",
    price: 99000,
    duration_months: 1,
    description:
      "Gói Cơ Bản Internet cung cấp tốc độ truy cập ổn định, phù hợp cho nhu cầu học tập, làm việc cơ bản và xem video trực tuyến.",
    data_info: "Tốc độ 50Mbps",
    syntax_register: "COBAN gửi 888",
    terms: [
      "Áp dụng cho khách hàng cá nhân mới hoặc gia hạn gói cước.",
      "Không áp dụng đồng thời với các chương trình khuyến mãi khác.",
    ],
    benefits: [
      "Miễn phí modem wifi thế hệ mới.",
      "Hỗ trợ kỹ thuật 24/7.",
      "Bảo trì miễn phí trong suốt thời gian hợp đồng.",
    ],
    questions: [
      {
        question: "Gói có giới hạn dung lượng không?",
        answer: "Không, gói cung cấp tốc độ 50Mbps và không giới hạn dung lượng truy cập.",
      },
    ],
    similar_packages: [
      { id: "pkg-002", name: "Gói Gia Đình Wifi Plus", data: "100Mbps", price: 199000 },
      { id: "pkg-003", name: "Gói Doanh Nghiệp Pro", data: "300Mbps", price: 499000 },
    ],
    provider_info: {
      company: "Viettel Telecom",
      address: "Số 1 Giang Văn Minh, Ba Đình, Hà Nội",
      hotline: "18008198",
      website: "https://viettel.vn",
    },
  },

  // --- GÓI DATA NGÀY ---
  {
    id: "pkg-101",
    package_name: "Gói Data Ngày D5",
    price: 5000,
    duration_months: 0,
    description:
      "Gói D5 cung cấp 1GB data tốc độ cao trong 1 ngày, phù hợp cho nhu cầu lướt web, Facebook, Zalo, và xem video ngắn.",
    data_info: "1GB/ngày",
    syntax_register: "D5 gửi 191",
    terms: [
      "Áp dụng cho thuê bao di động trả trước và trả sau.",
      "Hết 1GB, hệ thống ngắt kết nối, không phát sinh cước vượt gói.",
    ],
    benefits: [
      "1GB tốc độ cao mỗi ngày.",
      "Hết dung lượng ngắt truy cập, tránh phát sinh phí.",
    ],
    questions: [
      { question: "Gói D5 có tự gia hạn không?", answer: "Có, gói tự động gia hạn hàng ngày khi tài khoản đủ tiền." },
    ],
    similar_packages: [
      { id: "pkg-102", name: "Gói Data Ngày D10", data: "2GB", price: 10000 },
      { id: "pkg-103", name: "Gói Data Ngày D15", data: "3GB", price: 15000 },
    ],
    provider_info: {
      company: "Viettel Telecom",
      address: "Số 1 Giang Văn Minh, Ba Đình, Hà Nội",
      hotline: "18008198",
      website: "https://viettel.vn",
    },
  },

  // --- GÓI COMBO ---
  {
    id: "pkg-201",
    package_name: "Gói Combo 5G135N",
    price: 135000,
    duration_months: 1,
    description:
      "Gói 5G135N là gói data ưu đãi của Viettel, cung cấp dung lượng lớn cùng ưu đãi truy cập miễn phí các mạng xã hội phổ biến.",
    data_info: "6GB/ngày (180GB/tháng)",
    syntax_register: "5G135N gửi 191",
    terms: [
      "Áp dụng cho thuê bao di động trả trước và trả sau của Viettel.",
      "Hết dung lượng hệ thống dừng kết nối để đảm bảo không phát sinh phí.",
    ],
    benefits: [
      "Miễn phí truy cập Facebook, YouTube, TikTok.",
      "Dung lượng 6GB/ngày trong 30 ngày.",
      "Tặng thêm 2GB khi đăng ký qua MyViettel app.",
    ],
    questions: [
      {
        question: "Sau khi hết 6GB/ngày có bị trừ tiền không?",
        answer: "Không, gói sẽ ngắt truy cập để tránh phát sinh cước vượt gói.",
      },
      { question: "Có thể đăng ký lại trước khi hết hạn không?", answer: "Có, bạn có thể đăng ký lại bất kỳ lúc nào." },
    ],
    similar_packages: [
      { id: "pkg-202", name: "Gói Combo TikTok + YouTube", data: "10GB", price: 79000 },
      { id: "pkg-101", name: "Gói Data Ngày D5", data: "1GB/ngày", price: 5000 },
    ],
    provider_info: {
      company: "Viettel Telecom",
      address: "Số 1 Giang Văn Minh, Ba Đình, Hà Nội",
      hotline: "18008198",
      website: "https://viettel.vn",
    },
  },
];
