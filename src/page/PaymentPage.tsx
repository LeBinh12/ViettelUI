import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CustomerForm } from "../components/payment/CustomerForm";
import { OrderSummary } from "../components/payment/OrderSummary";
import { servicePackageApi } from "../api/servicePackage.api";
import type {
  Plan,
  PaymentMethod,
  CustomerInfo,
} from "../components/payment/paymentTypes";
import type { InvoiceRequest } from "../types/payment";
import { paymentApi } from "../api/paymentApi";
import { toast } from "react-toastify";

interface PaymentData {
  amount: number;
  plan: string;
  customer: CustomerInfo;
  last4?: string;
  expiry?: string;
  bankAccount?: string;
  autoRenew: boolean;
}

export default function PaymentPage(): React.JSX.Element {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pkgId = searchParams.get("id");

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [chosenMethod, setChosenMethod] = useState<PaymentMethod | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [autoRenew, setAutoRenew] = useState(true);

  // Validate
  useEffect(() => {
    const valid =
      customer.name.trim().length > 1 &&
      /^\d{9,12}$/.test(customer.phone.trim());
    setIsValid(valid);
  }, [customer]);

  // Load package
  useEffect(() => {
    if (!pkgId) return;

    const fetchPackage = async () => {
      try {
        const res = await servicePackageApi.getById(pkgId);
        if (res.succeeded && res.data) {
          setSelectedPlan({
            packageID: res.data.id,
            name: res.data.packageName,
            cents: res.data.price * 100,
            durationMonths: res.data.durationMonths,
          } as Plan);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPackage();
  }, [pkgId]);

  // Gửi request kiểm tra thay đổi → rồi mở popup thanh toán
  const handlePaymentClick = async () => {
    if (!selectedPlan || !isValid) return;

    const req: InvoiceRequest = {
      email: customer.email || "",
      packageId: selectedPlan.packageID, // OK
      amount: selectedPlan.cents / 100,
      fullName: customer.name,
      phone: customer.phone,
      address: customer.address || "",
      isChange: false,
    };

    console.log(req);
    try {
      const res = await paymentApi.request(req);
      console.log("resMessage", res);
      if (!res.succeeded) {
        alert("Có lỗi xảy ra: " + res.message);
        return;
      }

      if (!res.data.hasChanges) {
        toast.success(res.message);
        return;
      }
      toast.success(res.message);

      // Không thay đổi → lưu data để hiển thị popup
      setPaymentData({
        amount: req.amount,
        plan: selectedPlan.name,
        customer,
        autoRenew,
      });

      setShowPopup(true);
    } catch (err) {
      console.error(err);
      alert("Gửi yêu cầu thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white pb-20 px-4">
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden md:flex">
          {/* LEFT */}
          <div className="p-6 md:w-2/3">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-3">
              Thanh toán gói cước
            </h2>

            <CustomerForm
              customer={customer}
              setCustomer={setCustomer}
              isValid={isValid}
            />

            {/* Auto renew */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Tùy chọn gia hạn</h3>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="autoRenew"
                    checked={autoRenew}
                    onChange={() => setAutoRenew(true)}
                  />
                  <span className="ml-2">Gia hạn tự động</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="autoRenew"
                    checked={!autoRenew}
                    onChange={() => setAutoRenew(false)}
                  />
                  <span className="ml-2">Không gia hạn</span>
                </label>
              </div>
            </div>

            <button
              onClick={handlePaymentClick}
              disabled={!isValid}
              className="mt-6 w-full py-3 rounded-lg text-white font-semibold bg-orange-600 hover:bg-orange-700"
            >
              Tiến hành thanh toán
            </button>
          </div>

          {/* RIGHT */}
          <div className="p-6 md:w-1/3 bg-gray-50">
            {selectedPlan ? (
              <OrderSummary
                selectedPlan={selectedPlan}
                customer={paymentData?.customer || customer}
                last4={paymentData?.last4}
                expiry={paymentData?.expiry}
                bankAccount={paymentData?.bankAccount}
                autoRenew={autoRenew}
                selectedMethods={chosenMethod ? [chosenMethod] : []}
              />
            ) : (
              <div className="text-center text-gray-500">Chưa có thông tin</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
