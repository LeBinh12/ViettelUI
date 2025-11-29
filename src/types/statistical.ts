export interface StatisticalResponse {
    message: string,
    succeeded: boolean,
    data: number,
    code: number
}

export interface TotalPackageByCategory {
    message: string,
    succeeded: boolean,
    data: Record<string, number>,
    code: number
}


export interface TopCustomer {
    customerId: string,
    customerName: string,
    totalRevenue: number
}

export interface ListTopCustomersResponse {
    message: string,
    succeeded: boolean,
    data: TopCustomer[],
    code: number
}
