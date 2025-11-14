import type { ServicePackageDetail } from "../../types/servicePackageDetail";

export const mockServicePackageDetails: ServicePackageDetail[] = [
  // === GÓI INTERNET ===
  {
    id: "pkg-001",
    package_name: "Gói Cơ Bản Internet",
    price: 99000,
    duration_months: 1,
    description: `<p>Gói <strong>Cơ Bản Internet</strong> mang lại tốc độ truy cập ổn định, phù hợp cho hộ gia đình nhỏ hoặc cá nhân làm việc tại nhà.</p>
    <p>Cung cấp đường truyền tốc độ <strong>30Mbps</strong>, hỗ trợ kết nối tối đa 4 thiết bị cùng lúc.</p>`,
    data_info: `<p><strong>30 Mbps</strong> băng thông</p>`,
    syntax_register: `<p><code>CBI gửi 191</code></p>`,
    benefits: [
      `<p>Miễn phí modem Wi-Fi.</p>`,
      `<p>Không giới hạn dung lượng truy cập.</p>`,
      `<p>Hỗ trợ kỹ thuật 24/7.</p>`,
    ],
    similar_packages: [
      { id: "pkg-002", name: "Gói Gia Đình Wifi Plus", data: "50 MB", price: 199000 },
      { id: "pkg-004", name: "Gói Internet Tốc Độ Cao", data: "100 MB", price: 299000 },
      { id: "pkg-005", name: "Gói Internet VIP Fiber", data: "200 MB", price: 799000 },
    ],
    provider_info: {
      company: "Viettel Telecom",
      address: "Số 1 Giang Văn Minh, Ba Đình, Hà Nội",
      hotline: "18008198",
      website: "https://viettel.vn",
    },
  },

  {
    id: "pkg-002",
    package_name: "Gói Gia Đình Wifi Plus",
    price: 199000,
    duration_months: 3,
    description: `<p><strong>Wifi Plus</strong> cung cấp tốc độ <strong>50 Mbps</strong>, ổn định cho nhu cầu học tập và giải trí của gia đình.</p>`,
    data_info: `<p><strong>50 Mbps</strong></p>`,
    syntax_register: `<p><code>WFPLUS gửi 191</code></p>`,
    benefits: [
      `<p>Miễn phí lắp đặt và thiết bị modem.</p>`,
      `<p>Hỗ trợ kỹ thuật tận nơi.</p>`,
      `<p>Tặng thêm 1 tháng khi đóng cước 6 tháng.</p>`,
    ],
    similar_packages: [
      { id: "pkg-001", name: "Gói Cơ Bản Internet", data: "30 MB", price: 99000 },
      { id: "pkg-004", name: "Gói Internet Tốc Độ Cao", data: "100 MB", price: 299000 },
    ],
    provider_info: {
      company: "VNPT",
      address: "57 Huỳnh Thúc Kháng, Hà Nội",
      hotline: "18001091",
      website: "https://vnpt.com.vn",
    },
  },

  {
    id: "pkg-003",
    package_name: "Gói Doanh Nghiệp Pro",
    price: 499000,
    duration_months: 6,
    description: `<p><strong>Doanh Nghiệp Pro</strong> cung cấp băng thông <strong>150 Mbps</strong> ổn định, cam kết uptime 99.9%.</p>`,
    data_info: `<p><strong>150 Mbps</strong></p>`,
    syntax_register: `<p><code>DNPRO gửi 191</code></p>`,
    benefits: [
      `<p>IP tĩnh miễn phí.</p>`,
      `<p>Ưu tiên hỗ trợ kỹ thuật 24/7.</p>`,
      `<p>Báo cáo thống kê sử dụng hàng tháng.</p>`,
    ],
    similar_packages: [
      { id: "pkg-004", name: "Gói Internet Tốc Độ Cao", data: "100 MB", price: 299000 },
      { id: "pkg-005", name: "Gói Internet VIP Fiber", data: "200 MB", price: 799000 },
    ],
    provider_info: {
      company: "FPT Telecom",
      address: "48 Vạn Bảo, Ba Đình, Hà Nội",
      hotline: "19006600",
      website: "https://fpt.vn",
    },
  },

  {
    id: "pkg-004",
    package_name: "Gói Internet Tốc Độ Cao",
    price: 299000,
    duration_months: 3,
    description: `<p><strong>Internet Tốc Độ Cao</strong> mang đến trải nghiệm mượt mà với băng thông 100 Mbps – phù hợp xem phim, học trực tuyến.</p>`,
    data_info: `<p><strong>100 Mbps</strong></p>`,
    syntax_register: `<p><code>ITDC gửi 191</code></p>`,
    benefits: [
      `<p>Miễn phí modem và lắp đặt.</p>`,
      `<p>Tặng thêm 5GB data di động khi đăng ký cùng SIM Viettel.</p>`,
      `<p>Bảo trì miễn phí trong suốt thời gian sử dụng.</p>`,
    ],
    similar_packages: [
      { id: "pkg-001", name: "Gói Cơ Bản Internet", data: "30 MB", price: 99000 },
      { id: "pkg-002", name: "Wifi Plus", data: "50 MB", price: 199000 },
      { id: "pkg-005", name: "VIP Fiber", data: "200 MB", price: 799000 },
    ],
    provider_info: {
      company: "Viettel Telecom",
      address: "Số 1 Giang Văn Minh, Ba Đình, Hà Nội",
      hotline: "18008198",
      website: "https://viettel.vn",
    },
  },

  {
    id: "pkg-005",
    package_name: "Gói Internet VIP Fiber",
    price: 799000,
    duration_months: 12,
    description: `<p><strong>VIP Fiber</strong> là gói cao cấp với tốc độ đường truyền lên tới <strong>200 Mbps</strong>, phù hợp doanh nghiệp nhỏ hoặc gia đình nhiều thiết bị.</p>`,
    data_info: `<p><strong>200 Mbps</strong></p>`,
    syntax_register: `<p><code>VIPF gửi 191</code></p>`,
    benefits: [
      `<p>Miễn phí lắp đặt.</p>`,
      `<p>Bảo hành thiết bị trọn đời.</p>`,
      `<p>Tặng 2 tháng sử dụng khi thanh toán năm.</p>`,
    ],
    similar_packages: [
      { id: "pkg-004", name: "Internet Tốc Độ Cao", data: "100 MB", price: 299000 },
      { id: "pkg-003", name: "Doanh Nghiệp Pro", data: "150 MB", price: 499000 },
    ],
    provider_info: {
      company: "Viettel Telecom",
      address: "Số 1 Giang Văn Minh, Ba Đình, Hà Nội",
      hotline: "18008198",
      website: "https://viettel.vn",
    },
  },

  // === GÓI DATA NGÀY ===
  {
    id: "pkg-101",
    package_name: "Gói Data Ngày D5",
    price: 5000,
    duration_months: 0,
    description: `<p>Gói <strong>D5</strong> cung cấp <strong>500MB/ngày</strong>, thích hợp cho người dùng kiểm tra mạng xã hội, email.</p>`,
    data_info: `<p><strong>500MB/ngày</strong></p>`,
    syntax_register: `<p><code>D5 gửi 191</code></p>`,
    benefits: [
      `<p>Tốc độ cao 4G trong 24h.</p>`,
      `<p>Không gia hạn tự động.</p>`,
    ],
    similar_packages: [
      { id: "pkg-102", name: "D10", data: "1GB", price: 10000 },
      { id: "pkg-103", name: "D15", data: "2GB", price: 15000 },
    ],
    provider_info: {
      company: "Viettel Telecom",
      address: "Số 1 Giang Văn Minh, Ba Đình, Hà Nội",
      hotline: "18008198",
      website: "https://viettel.vn",
    },
  },

  // === GÓI COMBO ===
  {
    id: "pkg-201",
    package_name: "Gói Combo 5G135N",
    price: 135000,
    duration_months: 1,
    description: `<p>Gói <strong>5G135N</strong> cung cấp <em>6GB/ngày</em> (tổng 180GB/tháng), miễn phí truy cập Facebook, YouTube, TikTok.</p>`,
    data_info: `<p><strong>180GB (6GB/ngày)</strong></p>`,
    syntax_register: `<p><code>5G135N LUON gửi 290</code></p>`,
    benefits: [
      `<p>Miễn phí Facebook, YouTube, TikTok.</p>`,
      `<p>Tốc độ cao 4G/5G trong 30 ngày.</p>`,
      `<p>Tặng 2GB khi đăng ký qua MyViettel.</p>`,
    ],
    similar_packages: [
      { id: "pkg-202", name: "Combo TikTok + YouTube", data: "5GB", price: 79000 },
      { id: "pkg-203", name: "Combo Facebook + Instagram", data: "6GB", price: 89000 },
    ],
    provider_info: {
      company: "Viettel Telecom",
      address: "Số 1 Giang Văn Minh, Ba Đình, Hà Nội",
      hotline: "18008198",
      website: "https://viettel.vn",
    },
  },
];
