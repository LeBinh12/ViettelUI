import React from 'react';
import type { CustomerInfo, PaymentMethod, Plan } from './paymentTypes';

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
        return new Intl.NumberFormat('vi-VN').format(cents / 100) + 'đ';
    };

    return (
        <div className="space-y-4">
            {/* Thông tin khách hàng */}
            {customer && customer.name && (
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-700">Khách hàng</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Họ tên</span>
                            <span className="font-medium text-gray-800">{customer.name}</span>
                        </div>
                        {customer.phone && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Số điện thoại</span>
                                <span className="font-medium text-gray-800">{customer.phone}</span>
                            </div>
                        )}
                        {customer.email && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium text-gray-800 text-xs">{customer.email}</span>
                            </div>
                        )}
                        {customer.address && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Địa chỉ</span>
                                <span className="font-medium text-gray-800 text-xs text-right max-w-32 truncate">{customer.address}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Phương thức thanh toán */}
            {(method || last4 || bankAccount) && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-200">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-700">Thanh toán</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        {method && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Phương thức</span>
                                <span className="font-medium text-purple-700 capitalize">{method}</span>
                            </div>
                        )}
                        {last4 && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Số thẻ</span>
                                <span className="font-medium text-gray-800 font-mono">•••• •••• •••• {last4}</span>
                            </div>
                        )}
                        {expiry && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Hết hạn</span>
                                <span className="font-medium text-gray-800">{expiry}</span>
                            </div>
                        )}
                        {bankAccount && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Tài khoản</span>
                                <span className="font-medium text-gray-800">{bankAccount}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Lưu ý */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="text-amber-800 text-xs font-medium">Lưu ý</p>
                        <p className="text-amber-700 text-xs mt-0.5">Vui lòng kiểm tra kỹ thông tin trước khi xác nhận thanh toán.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};






// import React from 'react';
// import type { Plan, PaymentMethod, CustomerInfo } from './paymentTypes';

// interface OrderSummaryProps {
//     selectedPlan: Plan;
//     customer?: CustomerInfo;
//     method?: PaymentMethod | null;
//     last4?: string;
//     expiry?: string;
//     bankAccount?: string;
//     autoRenew?: boolean;
//     selectedMethods?: PaymentMethod[];
// }

// const planImages: Record<string, string> = {
//     'Basic Plan': 'https://via.placeholder.com/300x150/10B981/FFFFFF?text=Basic+Plan',
//     'Pro Plan': 'https://via.placeholder.com/300x150/3B82F6/FFFFFF?text=Pro+Plan',
//     'Enterprise Plan': 'https://via.placeholder.com/300x150/8B5CF6/FFFFFF?text=Enterprise+Plan',
// };

// export const OrderSummary: React.FC<OrderSummaryProps> = ({
//     selectedPlan,
//     customer,
//     method,
//     last4,
//     expiry,
//     bankAccount,
//     autoRenew,
// }) => {
//     const formatPrice = (cents: number) => {
//         const vnd = cents * 23000; // 1 USD = 23,000 VND (giả lập)
//         return new Intl.NumberFormat('vi-VN').format(vnd) + ' VND';
//     };

//     return (
//         <div className="bg-white rounded-xl shadow-md p-5">
//             <h3 className="text-xl font-bold mb-4 text-gray-800">Tóm tắt đơn hàng</h3>

//             {/* ẢNH GÓI */}
//             <img
//                 src={planImages[selectedPlan.name] || 'https://via.placeholder.com/300x150'}
//                 alt={selectedPlan.name}
//                 className="w-full h-32 object-cover rounded-lg mb-4"
//             />

//             <div className="space-y-3 text-sm">
//                 {/* Gói */}
//                 <div className="flex justify-between">
//                     <span className="font-medium text-gray-600">Gói:</span>
//                     <span className="font-semibold text-indigo-700">{selectedPlan.name}</span>
//                 </div>

//                 {/* Khách hàng */}
//                 {customer && (
//                     <>
//                         <div className="flex justify-between">
//                             <span className="font-medium text-gray-600">Khách hàng:</span>
//                             <span className="font-semibold text-gray-800">{customer.name}</span>
//                         </div>
//                         {customer.email && (
//                             <div className="flex justify-between">
//                                 <span className="font-medium text-gray-600">Email:</span>
//                                 <span>{customer.email}</span>
//                             </div>
//                         )}
//                     </>
//                 )}

//                 {/* Phương thức thanh toán */}
//                 {method && (
//                     <div className="flex justify-between">
//                         <span className="font-medium text-gray-600">Thanh toán qua:</span>
//                         <span className="capitalize">{method}</span>
//                     </div>
//                 )}

//                 {/* Thông tin thẻ hoặc ngân hàng */}
//                 {last4 && (
//                     <div className="flex justify-between">
//                         <span className="font-medium text-gray-600">Thẻ:</span>
//                         <span>**** **** **** {last4}</span>
//                     </div>
//                 )}
//                 {bankAccount && (
//                     <div className="flex justify-between">
//                         <span className="font-medium text-gray-600">Tài khoản:</span>
//                         <span>{bankAccount}</span>
//                     </div>
//                 )}

//                 {/* Gia hạn */}
//                 {autoRenew !== undefined && (
//                     <div className="flex justify-between">
//                         <span className="font-medium text-gray-600">Gia hạn:</span>
//                         <span>{autoRenew ? 'Tự động' : 'Không'}</span>
//                     </div>
//                 )}

//                 {/* Tổng cộng */}
//                 <div className="flex justify-between text-lg font-bold text-blue-600">
//                     <span>Tổng cộng:</span>
//                     <span>{formatPrice(selectedPlan.cents / 100)}</span>
//                 </div>
//             </div>
//         </div>
//     );
// };
