import { useEffect, useState } from "react";
import InvoiceTable from "../components/Invoice/InvoiceTable";
import ShowInvoiceForm from "../components/Invoice/ShowInvoiceForm";
import type { Invoice } from "../types/invoice";
import { mockInvoiceDetail } from "../data/mock/invoice.mock";
import type { InvoiceDetail } from "../components/Invoice/ShowInvoiceForm";

const InvoiceScreen = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null);
    const [isCallback, setIsCallback] = useState(false);

  useEffect(() => {
    setInvoices([
      {
        id: "inv-001",
        customerName: "Nguyễn Thanh Hào",
        amount: 1200000,
        date: "2025-01-01",
        status: "Paid",
      },
      {
        id: "inv-002",
        customerName: "Trần Minh Tâm",
        amount: 850000,
        date: "2025-01-09",
        status: "Pending",
      },
    ]);
  }, []);

  const handleView = (id: string) => {
    const found = mockInvoiceDetail.find((e) => e.id === id);
    if (found) setSelectedInvoice(found);
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Quản lý hóa đơn</h2>

      <InvoiceTable
        invoices={invoices}
        onView={handleView}
        isCallback={isCallback}
        setIsCallback={setIsCallback}
      />

      <ShowInvoiceForm
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

export default InvoiceScreen;
