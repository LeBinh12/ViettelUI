export interface Invoice {
    id: string;
    customerName: string;
    amount: number;
    date: string;
    status: 'Paid' | 'Pending' | 'Cancelled';
}
