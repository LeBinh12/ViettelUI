import React from 'react';
import type { Plan, PaymentMethod, CustomerInfo } from './paymentTypes';

interface OrderSummaryProps {
    selectedPlan: Plan;
    customer?: CustomerInfo;
    method?: PaymentMethod | null;
    last4?: string;
    expiry?: string;
    bankAccount?: string;
    autoRenew?: boolean;
    selectedMethods?: PaymentMethod[];
}

const planImages: Record<string, string> = {
    'Basic Plan': 'https://via.placeholder.com/300x150/10B981/FFFFFF?text=Basic+Plan',
    'Pro Plan': 'https://via.placeholder.com/300x150/3B82F6/FFFFFF?text=Pro+Plan',
    'Enterprise Plan': 'https://via.placeholder.com/300x150/8B5CF6/FFFFFF?text=Enterprise+Plan',
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    selectedPlan,
    customer,
    method,
    last4,
    expiry,
    bankAccount,
    autoRenew,
}) => {
    const formatPrice = (cents: number) => {
        const vnd = cents * 23000; // 1 USD = 23,000 VND (giả lập)
        return new Intl.NumberFormat('vi-VN').format(vnd) + ' VND';
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Tóm tắt đơn hàng</h3>

            {/* ẢNH GÓI */}
            <img
                src={planImages[selectedPlan.name] || 'https://via.placeholder.com/300x150'}
                alt={selectedPlan.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
            />

            <div className="space-y-3 text-sm">
                {/* Gói */}
                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Gói:</span>
                    <span className="font-semibold text-indigo-700">{selectedPlan.name}</span>
                </div>

                {/* Khách hàng */}
                {customer && (
                    <>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Khách hàng:</span>
                            <span className="font-semibold text-gray-800">{customer.name}</span>
                        </div>
                        {customer.email && (
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Email:</span>
                                <span>{customer.email}</span>
                            </div>
                        )}
                    </>
                )}

                {/* Phương thức thanh toán */}
                {method && (
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Thanh toán qua:</span>
                        <span className="capitalize">{method}</span>
                    </div>
                )}

                {/* Thông tin thẻ hoặc ngân hàng */}
                {last4 && (
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Thẻ:</span>
                        <span>**** **** **** {last4}</span>
                    </div>
                )}
                {bankAccount && (
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Tài khoản:</span>
                        <span>{bankAccount}</span>
                    </div>
                )}

                {/* Gia hạn */}
                {autoRenew !== undefined && (
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Gia hạn:</span>
                        <span>{autoRenew ? 'Tự động' : 'Không'}</span>
                    </div>
                )}

                {/* Tổng cộng */}
                <div className="flex justify-between text-lg font-bold text-blue-600">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(selectedPlan.cents / 100)}</span>
                </div>
            </div>
        </div>
    );
};
