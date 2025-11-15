import type { User } from "../../types/user";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    phone: "0987654321",
    packageName: "ST120K",
    startDate: "2025-10-01",
    endDate: "2026-10-01",
    status: "Đang hoạt động",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranb@example.com",
    phone: "0912345678",
    packageName: "V90",
    startDate: "2025-05-15",
    endDate: "2026-05-15",
    status: "Hết hạn",
  },
];
