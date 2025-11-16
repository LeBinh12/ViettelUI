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

export interface UserDTO {
    isValid: boolean,
    id: string,
    username: string,
    email: string,
    role: string
}

export interface UserResponse {
    status: number,
    message: string,
    data: UserDTO,
    code: number
}
