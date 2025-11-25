import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { paymentApi } from "../api/paymentApi";
import { servicePackageApi } from "../api/servicePackage.api";
import { CustomerForm } from "../components/payment/CustomerForm";
import { OrderSummary } from "../components/payment/OrderSummary";
import type {
  CustomerInfo,
  PaymentMethod,
  Plan,
} from "../components/payment/paymentTypes";
import type { InvoiceRequest } from "../types/payment";

interface PaymentData {
  amount: number;
  plan: string;
  customer: CustomerInfo;
  last4?: string;
  expiry?: string;
  bankAccount?: string;
  autoRenew: boolean;
}

interface SimilarPackage {
  id: string;
  packageName: string;
  price: number;
  durationMonths: number;
  description?: string;
}

export default function PaymentPage(): React.JSX.Element {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pkgId = searchParams.get("id");

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [similarPackages, setSimilarPackages] = useState<SimilarPackage[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [isConfirmingPassword, setIsConfirmingPassword] = useState(false);

  useEffect(() => {
    const valid =
      customer.name.trim().length > 1 &&
      /^\d{9,12}$/.test(customer.phone.trim());
    setIsValid(valid);
    if (valid) setCurrentStep(2);
    else if (
      customer.name.trim().length > 0 ||
      customer.phone.trim().length > 0
    )
      setCurrentStep(1);
  }, [customer]);

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

  useEffect(() => {
    const fetchSimilarPackages = async () => {
      setLoadingSimilar(true);
      try {
        const res = await servicePackageApi.getAll();
        if (res.succeeded && res.data) {
          const filtered = res.data
            .filter((pkg: any) => pkg.id !== pkgId)
            .slice(0, 3)
            .map((pkg: any) => ({
              id: pkg.id,
              packageName: pkg.packageName,
              price: pkg.price,
              durationMonths: pkg.durationMonths,
              description:
                pkg.description ||
                `${pkg.packageName}: ${pkg.price.toLocaleString("vi-VN")}đ/${
                  pkg.durationMonths * 30
                } ngày...`,
            }));
          setSimilarPackages(filtered);
        }
      } catch (err) {
        console.error("Error loading similar packages:", err);
      } finally {
        setLoadingSimilar(false);
      }
    };
    fetchSimilarPackages();
  }, [pkgId]);

  const handleSelectSimilarPackage = async (packageId: string) => {
    setLoadingSimilar(true);
    try {
      const res = await servicePackageApi.getById(packageId);
      if (res.succeeded && res.data) {
        setSelectedPlan({
          packageID: res.data.id,
          name: res.data.packageName,
          cents: res.data.price * 100,
          durationMonths: res.data.durationMonths,
        } as Plan);
        window.history.pushState({}, "", `/payment?id=${packageId}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast.success(`Đã chọn gói ${res.data.packageName}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải gói cước");
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handlePaymentClick = async () => {
    if (!selectedPlan || !isValid) return;

    setIsProcessing(true);

    const baseReq: InvoiceRequest = {
      email: customer.email || "",
      packageId: selectedPlan.packageID,
      amount: selectedPlan.cents / 100,
      fullName: customer.name,
      phone: customer.phone,
      address: customer.address || "",
      IsRegister: false, // lần đầu gửi là false
    };

    try {
      const res = await paymentApi.request(baseReq);

      if (!res.succeeded) {
        toast.error("Có lỗi xảy ra: " + res.message);
        setIsProcessing(false);
        return;
      }

      // Trường hợp KHÔNG cần mật khẩu → thành công ngay
      if (!res.data.isPassword) {
        toast.success(res.message || "Đăng ký thành công!");
        setCurrentStep(3);
        setTimeout(() => {
          window.location.href = `/payment-confirm?email=${encodeURIComponent(
            customer.email || ""
          )}`;
        }, 1500);
        return;
      }

      // Trường hợp CẦN NHẬP MẬT KHẨU (đã từng đăng ký)
      toast.info("Tài khoản đã tồn tại. Vui lòng nhập mật khẩu để tiếp tục.");
      setShowPasswordPopup(true);
      setPaymentData({
        amount: baseReq.amount,
        plan: selectedPlan.name,
        customer,
        autoRenew,
      });
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      toast.error("Gửi yêu cầu thất bại");
      setIsProcessing(false);
    }
  };

  // Hàm xác nhận mật khẩu và gửi lại
  const handleConfirmPassword = async () => {
    if (!password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }
    setIsConfirmingPassword(true);

    const confirmReq: InvoiceRequest = {
      email: customer.email || "",
      packageId: selectedPlan!.packageID,
      amount: selectedPlan!.cents / 100,
      fullName: customer.name,
      phone: customer.phone,
      address: customer.address || "",
      IsRegister: true, // quan trọng: lần 2 phải là true
      password: password.trim(),
    };

    try {
      const res = await paymentApi.request(confirmReq);

      if (!res.succeeded) {
        toast.error(res.message || "Mật khẩu không đúng hoặc có lỗi xảy ra");
        return;
      }

      toast.success("Xác thực thành công! Đang chuyển đến trang xác nhận...");
      setCurrentStep(3);
      setShowPasswordPopup(false);

      setTimeout(() => {
        window.location.href = `/payment-confirm?email=${encodeURIComponent(
          customer.email || ""
        )}`;
      }, 1500);
    } catch (err) {
      toast.error("Xác thực thất bại. Vui lòng thử lại.");
    } finally {
      setIsConfirmingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Header với hiệu ứng gradient animated */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white py-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Đăng ký gói cước</h1>
              <p className="text-red-100">
                Hoàn tất đăng ký trong 3 bước đơn giản
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps cải tiến */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-12 right-12 h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
            {[
              { step: 1, label: "Thông tin", icon: "👤" },
              { step: 2, label: "Xác nhận", icon: "✅" },
              { step: 3, label: "Hoàn tất", icon: "🎉" },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center flex-1 relative z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 transform ${
                    currentStep >= item.step
                      ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > item.step ? "✓" : item.icon}
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                    currentStep >= item.step ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">
            {/* Customer Form Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Thông tin khách hàng
                  </h2>
                  <p className="text-sm text-gray-500">
                    Vui lòng điền đầy đủ thông tin
                  </p>
                </div>
                {isValid && (
                  <span className="ml-auto px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                    ✓ Hợp lệ
                  </span>
                )}
              </div>
              <CustomerForm
                customer={customer}
                setCustomer={setCustomer}
                isValid={isValid}
              />
            </div>

            {/* Auto Renew Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Tùy chọn gia hạn
                  </h2>
                  <p className="text-sm text-gray-500">
                    Chọn hình thức gia hạn phù hợp
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-red-400 ${
                    autoRenew
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="autoRenew"
                    checked={autoRenew}
                    onChange={() => setAutoRenew(true)}
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      Gia hạn tự động
                      <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                        Khuyên dùng
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Gói cước sẽ tự động gia hạn khi hết hạn, không lo gián
                      đoạn dịch vụ
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      autoRenew ? "bg-red-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {autoRenew && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </label>
                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-red-400 ${
                    !autoRenew
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="autoRenew"
                    checked={!autoRenew}
                    onChange={() => setAutoRenew(false)}
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-semibold text-gray-800">
                      Không gia hạn
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Gói cước sẽ hết hạn sau chu kỳ đăng ký
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      !autoRenew ? "bg-red-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {!autoRenew && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Similar Packages Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Gói tương tự
                    </h2>
                    <p className="text-sm text-gray-500">Có thể bạn quan tâm</p>
                  </div>
                </div>
                <a
                  href="/packages"
                  className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-700 transition-colors group"
                >
                  Xem tất cả
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
              {loadingSimilar ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {similarPackages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-md p-5 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-red-200 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500"></div>
                      <h3 className="text-red-600 font-bold text-lg mb-1 group-hover:scale-105 transition-transform duration-300">
                        {pkg.packageName}{" "}
                        <span className="text-gray-500 font-normal text-sm">
                          / tháng
                        </span>
                      </h3>
                      <p className="text-gray-400 text-xs mb-3">
                        Miễn phí data
                      </p>
                      <div className="flex justify-center gap-2 mb-3">
                        <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center hover:scale-110 hover:bg-red-100 transition-all duration-300">
                          <svg
                            className="w-5 h-5 text-red-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </div>
                        <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center hover:scale-110 hover:bg-red-100 transition-all duration-300">
                          <svg
                            className="w-5 h-5 text-red-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </div>
                        <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center hover:scale-110 hover:bg-red-100 transition-all duration-300">
                          <svg
                            className="w-5 h-5 text-red-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mb-4 group-hover:scale-105 transition-transform duration-300">
                        <span className="text-2xl font-bold text-gray-900">
                          {pkg.price.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-gray-400 text-sm ml-1">
                          / Tháng
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSelectSimilarPackage(pkg.id)}
                          className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-600 hover:shadow-lg active:scale-95 transition-all duration-200"
                        >
                          Đăng ký
                        </button>
                        <button
                          onClick={() =>
                            (window.location.href = `/package/${pkg.id}`)
                          }
                          className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-200"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Đơn hàng</h3>
                  <p className="text-sm text-gray-500">Kiểm tra thông tin</p>
                </div>
              </div>

              {selectedPlan ? (
                <>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Gói cước</span>
                      <span className="font-bold text-red-600">
                        {selectedPlan.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Thời hạn</span>
                      <span className="font-medium">
                        {selectedPlan.durationMonths} tháng
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Gia hạn</span>
                      <span
                        className={`font-medium ${
                          autoRenew ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {autoRenew ? "Tự động" : "Không"}
                      </span>
                    </div>
                    <div className="border-t border-red-200 mt-3 pt-3 flex items-center justify-between">
                      <span className="text-gray-800 font-semibold">
                        Tổng cộng
                      </span>
                      <span className="text-2xl font-bold text-red-600">
                        {(selectedPlan.cents / 100).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                  <OrderSummary
                    selectedPlan={selectedPlan}
                    customer={paymentData?.customer || customer}
                    last4={paymentData?.last4}
                    expiry={paymentData?.expiry}
                    bankAccount={paymentData?.bankAccount}
                    autoRenew={autoRenew}
                    selectedMethods={chosenMethod ? [chosenMethod] : []}
                  />
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">Chưa chọn gói cước</p>
                  <a
                    href="/packages"
                    className="text-red-600 text-sm hover:underline mt-1 inline-block"
                  >
                    Chọn gói ngay →
                  </a>
                </div>
              )}

              <button
                onClick={handlePaymentClick}
                disabled={!isValid || isProcessing}
                className={`mt-5 w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 transform ${
                  !isValid || isProcessing
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 hover:shadow-xl hover:-translate-y-0.5 active:scale-98"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Xác nhận thanh toán
                  </span>
                )}
              </button>

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-3">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Bảo mật SSL 256-bit
                </div>
                <div className="flex justify-center gap-3">
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">
                      VISA
                    </span>
                  </div>
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-red-500">MC</span>
                  </div>
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-500">
                      MoMo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Popup nhập mật khẩu */}
      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Xác nhận tài khoản
              </h3>
              <p className="text-gray-600 mt-2">
                Số điện thoại <strong>{customer.phone}</strong> đã từng đăng ký.
                <br />
                Vui lòng nhập mật khẩu để tiếp tục.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleConfirmPassword()}
                className="w-full px-4 py-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Nhập mật khẩu của bạn"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Quên mật khẩu? Liên hệ{" "}
                <a href="tel:1900xxxx" className="text-red-600 hover:underline">
                  1900 xxxx
                </a>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordPopup(false);
                  setPassword("");
                }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmPassword}
                disabled={isConfirmingPassword || !password.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
              >
                {isConfirmingPassword ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang xác thực...
                  </span>
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
