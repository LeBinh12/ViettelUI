export interface Invoice {
    id: string;
    customerName: string;
    amount: number;
    date: string;
    status: 'Paid' | 'Pending' | 'Cancelled';
}


export interface InvoicePaymentCallback {
    message: string,
    succeeded: boolean,
    data: boolean,
    code: number,
}

// types.ts

export type InvoiceStatus = 0 | 1 | 2; // Pending = 0, Paid = 1, Cancelled = 2


export interface InvoiceResponseFilterDto {
    invoiceId: string;
    customerName: string; // là UUID
    amount: number;
    email: string;
    phone: string;
    packageName: string; // là UUID
    status: InvoiceStatus;
    isTampered: boolean;
    createdAt: string;
}

export interface GetAllInvoicesResponse {
    message: string;
    succeeded: boolean;
    data: InvoiceResponseFilterDto[];
    code: number;
}

export interface InvoiceFilterDto {
    invoiceId?: string;
    customerName?: string;
    email?: string;
    phone?: string;
    packageName?: string;
    status?: InvoiceStatus;
}
