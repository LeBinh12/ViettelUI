// src/page/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { PLANS } from '../components/payment/paymentData';
import { CustomerForm } from '../components/payment/CustomerForm';
import { OrderSummary } from '../components/payment/OrderSummary';
import { PaymentForm } from '../components/payment/PaymentForm';

import type { Plan, PaymentMethod, CustomerInfo } from '../components/payment/paymentTypes';

interface PaymentData {
    amount: number;
    plan: string;
    customer: CustomerInfo;
    method: PaymentMethod;
    last4?: string;
    expiry?: string;
    bankAccount?: string;
    autoRenew: boolean;
}

export default function PaymentPage(): React.JSX.Element {
    const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1]);
    const [customer, setCustomer] = useState<CustomerInfo>({ name: '', phone: '', email: '' });
    const [chosenMethod, setChosenMethod] = useState<PaymentMethod | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [autoRenew, setAutoRenew] = useState<boolean>(true); // MỚI

    useEffect(() => {
        const valid = customer.name.trim().length > 1 && /^\d{9,12}$/.test(customer.phone);
        setIsValid(valid);
    }, [customer]);

    const handleFormSubmit = (formData: {
        customerName?: string;
        customerEmail?: string;
        last4?: string;
        expiry?: string;
        bankAccount?: string;
    }) => {
        if (!chosenMethod || !isValid) return;

        const data: PaymentData = {
            amount: selectedPlan.cents / 100,
            plan: selectedPlan.name,
            customer: {
                name: formData.customerName || customer.name,
                phone: customer.phone,
                email: formData.customerEmail || customer.email,
            },
            method: chosenMethod,
            last4: formData.last4,
            expiry: formData.expiry,
            bankAccount: formData.bankAccount,
            autoRenew,
        };

        setPaymentData(data);
        setShowPopup(true);
    };

    const isPaymentFormRequired = (method: PaymentMethod | null) =>
        method && ['credit_card', 'bank_transfer', 'momo', 'paypal'].includes(method);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white pb-20 px-4">
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden md:flex">
                    {/* === PHẦN TRÁI === */}
                    <div className="p-6 md:w-2/3">
                        <h2 className="text-2xl font-extrabold text-gray-800 mb-3">Thanh toán gói cước</h2>


                        <CustomerForm customer={customer} setCustomer={setCustomer} isValid={isValid} />

                        {/* === 2 NÚT RADIO GIA HẠN === */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">Tùy chọn gia hạn</h3>
                            <div className="flex gap-6">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="autoRenew"
                                        checked={autoRenew}
                                        onChange={() => setAutoRenew(true)}
                                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="ml-2 text-gray-700">Gia hạn tự động</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="autoRenew"
                                        checked={!autoRenew}
                                        onChange={() => setAutoRenew(false)}
                                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="ml-2 text-gray-700">Không gia hạn</span>
                                </label>
                            </div>
                        </div>


                        <button
                            onClick={() => window.location.href = "/confirm-payment"}
                            disabled={!isValid}
                            className="mt-6 w-full py-3 rounded-lg text-white font-semibold bg-orange-600 hover:bg-orange-700"
                        >
                            Tiến hành thanh toán
                        </button>

                    </div>

                    {/* === PHẦN PHẢI: ORDER SUMMARY === */}
                    <div className="p-6 md:w-1/3 bg-gray-50">
                        {selectedPlan ? (
                            <OrderSummary
                                selectedPlan={selectedPlan}
                                customer={paymentData?.customer || customer}
                                method={paymentData?.method || chosenMethod}
                                last4={paymentData?.last4}
                                expiry={paymentData?.expiry}
                                bankAccount={paymentData?.bankAccount}
                                autoRenew={autoRenew}
                                selectedMethods={chosenMethod ? [chosenMethod] : []}
                            />
                        ) : (
                            <div className="p-6 md:w-1/3 bg-gray-50">
                                {selectedPlan ? (
                                    <OrderSummary selectedPlan={selectedPlan} />
                                ) : (
                                    <div className="text-center text-gray-500">Chưa có thông tin</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}