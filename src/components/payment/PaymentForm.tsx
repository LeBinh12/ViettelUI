// src/components/payment/PaymentForm.tsx
import React, { useState } from 'react';
import type { PaymentMethod } from './paymentTypes';

interface PaymentFormProps {
    method: PaymentMethod;
    phone?: string;
    onSubmit: (data: any) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ method, phone, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', cardNumber: '', expiry: '', cvv: '', bankAccount: ''
    });
    const [qrCode, setQrCode] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = { ...formData };

        if (method === 'credit_card') {
            const clean = formData.cardNumber.replace(/\s/g, '');
            data.last4 = clean.slice(-4);
        }

        if (['momo', 'vnpay'].includes(method) && phone) {
            const qr = `${method.toUpperCase()}|${phone}|299900`;
            data.qrData = qr;
            setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr)}`);
        }

        onSubmit(data);
    };

    if (method === 'paypal') {
        return (
            <div className="bg-blue-50 p-6 rounded-lg text-center">
                <p className="text-blue-700 font-medium">Chuyển hướng đến PayPal...</p>
            </div>
        );
    }

    if (['momo', 'vnpay'].includes(method)) {
        const brand = method === 'momo' ? { name: 'MoMo', color: 'bg-pink-600' } : { name: 'VNPay', color: 'bg-blue-600' };
        return (
            <div className="space-y-6">
                <div className={`p-6 rounded-lg text-center text-white ${brand.color}`}>
                    <div className="text-3xl font-bold mb-2">{brand.name}</div>
                    <p className="text-sm opacity-90">Sử dụng số: <strong>{phone}</strong></p>
                </div>
                {qrCode ? (
                    <div className="text-center">
                        <img src={qrCode} alt="QR" className="mx-auto w-48 h-48 border rounded-lg" />
                        <p className="mt-3 text-sm text-gray-600">Quét mã để thanh toán</p>
                    </div>
                ) : (
                    <button onClick={handleSubmit} className={`w-full py-3 ${brand.color} text-white font-bold rounded-lg hover:opacity-90`}>
                        Tạo mã QR
                    </button>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" name="name" required placeholder="Họ và tên" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            <input type="email" name="email" required placeholder="Email" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />

            {method === 'credit_card' && (
                <>
                    <input type="text" name="cardNumber" required placeholder="1234 5678 9012 3456" maxLength={19} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="expiry" required placeholder="MM/YY" maxLength={5} onChange={handleChange} className="px-4 py-2 border rounded-lg" />
                        <input type="text" name="cvv" required placeholder="CVV" maxLength={3} onChange={handleChange} className="px-4 py-2 border rounded-lg" />
                    </div>
                </>
            )}

            {method === 'bank_transfer' && (
                <input type="text" name="bankAccount" required placeholder="Số tài khoản" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            )}

            <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
                Tiến hành thanh toán
            </button>
        </form>
    );
};