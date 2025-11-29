import { API_URL } from "../config/config";
import axiosClient from "../utils/axiosClient";

// Hàm chung để tải file từ BE
const downloadFile = async (url: string, fileName: string) => {
    try {
        const response = await axiosClient.get(url, {
            responseType: "blob", // quan trọng để nhận file
        });
        const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Xuất Excel lỗi:", error);
    }
};

export const exportExcelApi = {
    dailySummary: async (date?: string) => {
        const fileName = `Daily_Summary_${date ?? new Date().toISOString().slice(0, 10)}.xlsx`;
        await downloadFile(`${API_URL}/StatisticalExport/daily-summary${date ? `?date=${date}` : ""}`, fileName);
    },
    monthlyRevenue: async (year: number) => {
        const fileName = `Monthly_Revenue_${year}.xlsx`;
        await downloadFile(`${API_URL}/StatisticalExport/monthly-revenue?year=${year}`, fileName);
    },
    topCustomers: async (top = 5) => {
        const fileName = `Top_${top}_Customers.xlsx`;
        await downloadFile(`${API_URL}/StatisticalExport/top-customers?top=${top}`, fileName);
    },
    packagesByCategory: async () => {
        const fileName = `Packages_By_Category.xlsx`;
        await downloadFile(`${API_URL}/StatisticalExport/packages-by-category`, fileName);
    },
    totalCustomers: async () => {
        const fileName = `Total_Customers_${new Date().toISOString().slice(0, 10)}.xlsx`;
        await downloadFile(`${API_URL}/StatisticalExport/total-customers`, fileName);
    },
    tamperedInvoices: async () => {
        const fileName = `Tampered_Invoices_${new Date().toISOString().slice(0, 10)}.xlsx`;
        await downloadFile(`${API_URL}/StatisticalExport/tampered-invoices`, fileName);
    },
};
