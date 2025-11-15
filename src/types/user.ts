export interface User {
    id: number;            // số cho dễ mock
    name: string;          // tên người dùng
    email: string;
    phone: string;
    packageName: string;
    startDate: string;     // YYYY-MM-DD
    endDate: string;       // YYYY-MM-DD
    status: "Đang hoạt động" | "Hết hạn";
}
