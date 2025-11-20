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

export interface CustomerAddRequest {
    email: string,
    fullName: string,
    phone: string,
    address: string,
}

export interface CustomerUpdateRequest {
    id: string,
    email: string,
    fullName: string,
    phone: string,
    address: string,
}


export interface CustomerAddResponse {
    message: string,
    succeeded: boolean,
    data: Customer,
    code: number
}

export interface CustomerDeleteResponse {
    message: string,
    succeeded: boolean,
    data: boolean,
    code: number,
}