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