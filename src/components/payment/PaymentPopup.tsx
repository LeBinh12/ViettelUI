// PaymentPopup.tsx
import React from 'react';
import type { PaymentData } from './paymentTypes';

interface PaymentPopupProps {
    data: PaymentData;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const PaymentPopup: React.FC<PaymentPopupProps> = ({
    data,
    isOpen,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    const formatMethod = () => {
        switch (data.method) {
            case 'credit_card': return 'Thẻ tín dụng';
            case 'paypal': return 'PayPal';
            case 'bank_transfer': return 'Chuyển khoản ngân hàng';
            default: return data.method;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">
                    Xác nhận thanh toán
                </h2>

                <div className="space-y-3 text-sm text-gray-700">
                    {/* THÔNG TIN KHÁCH HÀNG */}
                    {data.customer.name && (
                        <div className="flex justify-between">
                            <span className="font-medium">Khách hàng:</span>
                            <span className="text-right">{data.customer.name}</span>
                        </div>
                    )}
                    {data.customer.email && (
                        <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span className="text-right">{data.customer.email}</span>
                        </div>
                    )}

                    <hr className="my-3 border-gray-200" />

                    {/* GÓI DỊCH VỤ */}
                    {data.plan && (
                        <div className="flex justify-between">
                            <span className="font-medium">Gói:</span>
                            <span className="text-right font-semibold">{data.plan}</span>
                        </div>
                    )}

                    {/* PHƯƠNG THỨC */}
                    <div className="flex justify-between">
                        <span className="font-medium">Phương thức:</span>
                        <span className="text-right">{formatMethod()}</span>
                    </div>

                    {/* CHI TIẾT THẺ / TÀI KHOẢN */}
                    {data.method === 'credit_card' && data.last4 && (
                        <div className="flex justify-between text-xs">
                            <span>Thẻ kết thúc:</span>
                            <span>**** {data.last4}</span>
                        </div>
                    )}
                    {data.method === 'credit_card' && data.expiry && (
                        <div className="flex justify-between text-xs">
                            <span>Hết hạn:</span>
                            <span>{data.expiry}</span>
                        </div>
                    )}
                    {data.method === 'bank_transfer' && data.bankAccount && (
                        <div className="flex justify-between text-xs">
                            <span>Tài khoản:</span>
                            <span>***{data.bankAccount.slice(-4)}</span>
                        </div>
                    )}

                    <hr className="my-3 border-gray-200" />

                    {/* TỔNG TIỀN */}
                    {typeof data.amount === 'number' && (
                        <div className="flex justify-between text-lg font-bold text-blue-600">
                            <span>Tổng cộng:</span>
                            <span>{data.amount.toFixed(2)} {data.currency || 'VND'}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Xác nhận thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};
