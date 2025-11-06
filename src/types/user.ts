export interface UserResponse {
    status: number,
    message: string,
    data: User,
    code: number
}

export interface User {
    isValid: boolean,
    id: string,
    username: string,
    email: string,
    role: string
}