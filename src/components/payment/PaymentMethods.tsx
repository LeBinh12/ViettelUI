import React from 'react';
import type { PaymentMethod } from './paymentTypes';

interface PaymentMethodsProps {
    selected?: PaymentMethod | null;
    setSelectedMethod: (method: PaymentMethod) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
    selected,
    setSelectedMethod,
}) => {
    const methods: PaymentMethod[] = ['credit_card', 'bank_transfer', 'momo', 'paypal'];

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Chọn phương thức thanh toán</h3>
            <div className="flex gap-3 flex-wrap">
                {methods.map((method) => (
                    <button
                        key={method}
                        onClick={() => setSelectedMethod(method)}
                        className={`py-2 px-3 rounded-lg border font-medium ${selected === method
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {(() => {
                            switch (method) {
                                case 'credit_card': return 'Thẻ tín dụng';
                                case 'bank_transfer': return 'Chuyển khoản';
                                case 'momo': return 'Momo';
                                case 'paypal': return 'PayPal';
                            }
                        })()}
                    </button>
                ))}
            </div>
        </div>
    );
};
