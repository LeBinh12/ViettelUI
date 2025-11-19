import React from "react";
import type { CustomerInfo } from "./paymentTypes";

interface CustomerFormProps {
  customer: CustomerInfo;
  setCustomer: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  isValid: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  setCustomer,
  isValid,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4 mt-6">
      <div>
        <label className="block text-sm font-medium mb-1">Họ và tên</label>
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <input
          type="tel"
          name="phone"
          value={customer.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="0901234567"
        />
        {!isValid && customer.phone && (
          <p className="text-red-500 text-xs">Số điện thoại phải 9-12 số</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Email (tùy chọn)
        </label>
        <input
          type="email"
          name="email"
          value={customer.email || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Địa chỉ (tùy chọn)
        </label>
        <input
          type="text"
          name="address"
          value={customer.address || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="123 Đường ABC, Quận 1, TP.HCM"
        />
      </div>
    </div>
  );
};
