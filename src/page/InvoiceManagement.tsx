import React, { useState } from 'react';
import type { Invoice } from '../types/invoice';

const DUMMY_INVOICES: Invoice[] = [
    { id: 'HD001', customerName: 'Nguyễn Văn A', date: '2025-11-01', amount: 100000, status: 'Paid' },
    { id: 'HD002', customerName: 'Trần Thị B', date: '2025-11-02', amount: 200000, status: 'Pending' },
    { id: 'HD003', customerName: 'Lê Văn C', date: '2025-11-03', amount: 150000, status: 'Cancelled' },
    { id: 'HD004', customerName: 'Phạm Thị D', date: '2025-11-04', amount: 500000, status: 'Paid' },
];

export const InvoiceManagement: React.FC = () => {
    const [search, setSearch] = useState('');
    const [invoices, setInvoices] = useState<Invoice[]>(DUMMY_INVOICES);

    const filteredInvoices = invoices.filter(inv =>
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const statusColor = (status: Invoice['status']) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản lý hóa đơn</h1>

                {/* Search */}
                <div className="mb-6 flex gap-3">
                    <input
                        type="text"
                        placeholder="Tìm kiếm hóa đơn hoặc khách hàng..."
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        onClick={() => { }}
                    >
                        Tìm kiếm
                    </button>
                </div>

                {/* Invoice Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((inv) => (
                            <div
                                key={inv.id}
                                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-bold text-gray-800">{inv.id}</h2>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(inv.status)}`}>
                                        {inv.status}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Khách hàng:</span> {inv.customerName}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Ngày:</span> {inv.date}
                                </p>
                                <p className="text-gray-600 mb-3">
                                    <span className="font-medium">Tổng tiền:</span> {inv.amount.toLocaleString()} VND
                                </p>

                                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                                    Xem chi tiết
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">Không tìm thấy hóa đơn</p>
                    )}
                </div>
            </div>
        </div>
    );
};
