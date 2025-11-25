export interface LoginRequest {
    username: string,
    password: string,
}

export interface LoginCustomer {
    email: string,
    password: string,
}

export interface LoginResponse {
    status: number,
    message: string,
    data: string,
    code: number

}