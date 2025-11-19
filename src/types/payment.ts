export interface InvoiceRequest {
    email: string,
    packageId: string,
    amount: number,
    fullName: string,
    phone: string,
    address: string,
    isChange: boolean
}

export interface InvoiceResponseCheckResult {
    message: string,
    succeeded: boolean,
    data: {
        hasChanges: boolean,
        changedFields: string[],
        token: string
    },
    code: number,
}

export interface InvoiceResponseConfirmResult {
    message: string,
    succeeded: boolean,
    data: string,
    code: number,
}