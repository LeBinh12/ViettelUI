import { useState, useEffect } from "react";
import InvoiceTable from "../components/Invoice/InvoiceTable";
import type { Invoice } from "../types/invoice";

const InvoiceScreen = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // TODO: gọi API thật
    setInvoices([
      {
        id: "1",
        customerName: "Nguyễn Thanh Hào",
        amount: 1200000,
        date: "2025-01-01",
        status: "Paid",
      },
      {
        id: "2",
        customerName: "Trần Minh Tâm",
        amount: 850000,
        date: "2025-01-09",
        status: "Pending",
      },
    ]);
  }, []);

  const handleEdit = (invoice: Invoice) => {
    console.log("EDIT:", invoice);
  };

  const handleDelete = (id: string) => {
    console.log("DELETE:", id);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Quản lý hóa đơn</h2>

      <InvoiceTable
        invoices={invoices}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default InvoiceScreen;
