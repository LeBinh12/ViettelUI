import React from "react";
import { X } from "lucide-react";

export interface InvoiceDetail {
    id: string;
    amount: number;
    fullName: string;
    phone: string;
    packageName: string;
    durationMonths: number;
    dueDate: string;
    status: string;
    lastModified: string;
    note: string;
}

interface ShowInvoiceFormProps {
    invoice: InvoiceDetail | null;
    onClose: () => void;
}

const ShowInvoiceForm: React.FC<ShowInvoiceFormProps> = ({ invoice, onClose }) => {
    if (!invoice) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-slideUp">

                <div className="flex items-center justify-between px-6 py-4 bg-indigo-600 text-white">
                    <h2 className="text-xl font-semibold">Chi tiết hóa đơn</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    <Section title="Thông tin chung">
                        <FormRow label="Mã hóa đơn" value={invoice.id} />
                        <FormRow label="Số tiền" value={invoice.amount.toLocaleString() + " đ"} />
                        <FormRow label="Trạng thái" value={invoice.status} />
                    </Section>

                    <Section title="Khách hàng">
                        <FormRow label="Họ tên" value={invoice.fullName} />
                        <FormRow label="Số điện thoại" value={invoice.phone} />
                    </Section>

                    <Section title="Gói dịch vụ">
                        <FormRow label="Tên gói" value={invoice.packageName} />
                        <FormRow label="Thời hạn" value={`${invoice.durationMonths} tháng`} />
                        <FormRow label="Ngày hết hạn" value={invoice.dueDate.substring(0, 10)} />
                        <FormRow label="Cập nhật cuối" value={invoice.lastModified.substring(0, 10)} />
                    </Section>

                    <div>
                        <p className="font-medium text-gray-700 mb-1">Ghi chú</p>
                        <div className="p-3 border rounded-lg bg-gray-50 text-gray-800 whitespace-pre-line min-h-[60px]">
                            {invoice.note || "Không có ghi chú."}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h3 className="font-semibold text-indigo-700 mb-2">{title}</h3>
        <div className="space-y-2 bg-gray-50 p-3 rounded-xl border">
            {children}
        </div>
    </div>
);

const FormRow = ({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
    </div>
);

export default ShowInvoiceForm;
