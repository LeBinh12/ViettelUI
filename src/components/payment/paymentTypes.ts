// src/components/payment/paymentTypes.ts
export interface Plan {
    name: string;
    cents: number;
}
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'paypal' | 'momo' | 'vnpay' | 'qr';

export interface CustomerInfo {
    name: string;
    phone: string;
    email: string;
}

export interface PaymentData {
    amount: number;
    plan: string;
    customer: CustomerInfo;
    method: PaymentMethod;
    last4?: string;
    expiry?: string;
    bankAccount?: string;
    currency?: string; // optional
}