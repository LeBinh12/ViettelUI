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

  // Validate
  useEffect(() => {
    const valid =
      customer.name.trim().length > 1 &&
      /^\d{9,12}$/.test(customer.phone.trim());
    setIsValid(valid);

    // Auto update step based on form completion
    if (valid) {
      setCurrentStep(2);
    } else if (customer.name.trim().length > 0 || customer.phone.trim().length > 0) {
      setCurrentStep(1);
    }
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

  // Load similar packages
  useEffect(() => {
    const fetchSimilarPackages = async () => {
      setLoadingSimilar(true);
      try {
        // Giả sử có API để lấy danh sách gói cước
        const res = await servicePackageApi.getAll(); // hoặc API tương tự
        if (res.succeeded && res.data) {
          // Lọc ra 4 gói khác (không bao gồm gói hiện tại)
          const filtered = res.data
            .filter((pkg: any) => pkg.id !== pkgId)
            .slice(0, 4)
            .map((pkg: any) => ({
              id: pkg.id,
              packageName: pkg.packageName,
              price: pkg.price,
              durationMonths: pkg.durationMonths,
              description: pkg.description || `${pkg.packageName}: ${pkg.price.toLocaleString('vi-VN')}đ/${pkg.durationMonths * 30} ngày...`
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

        // Update URL without reload
        window.history.pushState({}, '', `/payment?id=${packageId}`);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        toast.success(`Đã chọn gói ${res.data.packageName}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải gói cước");
    } finally {
      setLoadingSimilar(false);
    }
  };

  const getPackageColor = (index: number) => {
    const colors = [
      'from-red-400 to-red-500',
      'from-pink-400 to-red-400',
      'from-red-500 to-orange-500',
      'from-red-600 to-red-400'
    ];
    return colors[index % colors.length];
  };

  // Gửi request kiểm tra thay đổi → hiển thị loading ngay tại nút
  const handlePaymentClick = async () => {
    if (!selectedPlan || !isValid) return;

    setIsProcessing(true);

    const req: InvoiceRequest = {
      email: customer.email || "",
      packageId: selectedPlan.packageID,
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
        toast.error("Có lỗi xảy ra: " + res.message);
        setIsProcessing(false);
        return;
      }

      if (!res.data.hasChanges) {
        toast.success(res.message);
        setCurrentStep(3);

        // Redirect to payment/QR page after success
        setTimeout(() => {
          window.location.href = `/payment-confirm?email=${encodeURIComponent(customer.email || '')}`;
        }, 1500);
        return;
      }

      toast.success(res.message);
      setCurrentStep(3);

      // Không thay đổi → lưu data để hiển thị popup
      setPaymentData({
        amount: req.amount,
        plan: selectedPlan.name,
        customer,
        autoRenew,
      });

      setShowPopup(true);

      // Redirect to payment confirmation page after showing popup
      setTimeout(() => {
        window.location.href = `/payment-confirm?email=${encodeURIComponent(customer.email || '')}`;
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Gửi yêu cầu thất bại");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Viettel style */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Đăng ký gói cước</h1>
          <p className="text-red-100">Hoàn tất đăng ký trong 3 bước đơn giản</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div
                className="h-full bg-red-600 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>

            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className={`mt-2 text-sm font-medium ${currentStep >= 1 ? 'text-red-600' : 'text-gray-500'}`}>
                Thông tin khách hàng
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span className={`mt-2 text-sm font-medium ${currentStep >= 2 ? 'text-red-600' : 'text-gray-500'}`}>
                Xác nhận thanh toán
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= 3 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {currentStep > 3 ? '✓' : '3'}
              </div>
              <span className={`mt-2 text-sm font-medium ${currentStep >= 3 ? 'text-red-600' : 'text-gray-500'}`}>
                Hoàn tất
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT - Form */}
          <div className="md:col-span-2">
            {/* Package Suggestions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">GÓI TƯƠNG TỰ</h2>
                <a href="/packages" className="text-red-600 font-semibold hover:text-red-700">
                  Xem tất cả →
                </a>
              </div>

              {loadingSimilar ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {similarPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-200"
                    >
                      {/* ----- HEADER (MÀU ĐỎ, KHÔNG GRADIENT) ----- */}
                      <div className="bg-red-600 text-white relative px-5 py-7 h-28 flex items-center rounded-t-2xl">
                        <h3 className="text-2xl font-bold truncate">
                          {pkg.packageName}
                        </h3>
                      </div>

                      {/* ----- BODY ----- */}
                      <div className="p-5 bg-white">
                        {/* Icons */}
                        <div className="flex justify-center gap-4 text-red-600 text-3xl mb-4">
                          <i className="fab fa-facebook"></i>
                          <i className="fab fa-youtube"></i>
                          <i className="fab fa-tiktok"></i>
                        </div>

                        {/* Price */}
                        <div className="text-center mb-4">
                          <span className="text-3xl font-bold text-gray-900">
                            {pkg.price.toLocaleString("vi-VN")}đ
                          </span>
                          <span className="text-gray-600 ml-1">/ Tháng</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 text-center line-clamp-2 mb-5">
                          {pkg.description ||
                            `${pkg.packageName}: ${pkg.price.toLocaleString("vi-VN")}đ`}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => handleSelectSimilarPackage(pkg.id)}
                            className="w-full py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                          >
                            Đăng ký
                          </button>

                          <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition">
                            Chi tiết
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>



            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Thông tin khách hàng
                </h2>
              </div>

              <CustomerForm
                customer={customer}
                setCustomer={setCustomer}
                isValid={isValid}
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Tùy chọn gia hạn
                </h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-red-600 hover:bg-red-50" style={{
                  borderColor: autoRenew ? '#dc2626' : '#e5e7eb',
                  backgroundColor: autoRenew ? '#fef2f2' : 'white'
                }}>
                  <input
                    type="radio"
                    name="autoRenew"
                    checked={autoRenew}
                    onChange={() => setAutoRenew(true)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="ml-3">
                    <div className="font-semibold text-gray-800">Gia hạn tự động</div>
                    <div className="text-sm text-gray-600">Gói cước sẽ tự động gia hạn khi hết hạn</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-red-600 hover:bg-red-50" style={{
                  borderColor: !autoRenew ? '#dc2626' : '#e5e7eb',
                  backgroundColor: !autoRenew ? '#fef2f2' : 'white'
                }}>
                  <input
                    type="radio"
                    name="autoRenew"
                    checked={!autoRenew}
                    onChange={() => setAutoRenew(false)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div className="ml-3">
                    <div className="font-semibold text-gray-800">Không gia hạn</div>
                    <div className="text-sm text-gray-600">Gói cước sẽ hết hạn sau chu kỳ đăng ký</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT - Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b">
                Thông tin đơn hàng
              </h3>

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
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📦</div>
                  <div>Chưa có thông tin gói cước</div>
                </div>
              )}

              <button
                onClick={handlePaymentClick}
                disabled={!isValid || isProcessing}
                className={`mt-6 w-full py-4 rounded-lg text-white font-bold text-lg transition-all transform ${!isValid || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 hover:shadow-lg active:scale-95'
                  }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  'Xác nhận thanh toán'
                )}
              </button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>🔒 Thông tin của bạn được bảo mật</p>
              </div>
            </div>
          </div>
        </div >
      </div >
    </div >
  );
}
