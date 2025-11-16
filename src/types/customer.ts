export interface Customer {
    id: string,
    fullName: string,
    email: string,
    phone: string,
    address: string
    createdAt: string
}

export interface GetAllCustomerResponse {
    message: string,
    succeeded: boolean,
    data: Customer[],
    code: number
}