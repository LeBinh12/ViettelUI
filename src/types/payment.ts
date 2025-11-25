export interface InvoiceRequest {
    email: string,
    packageId: string,
    amount: number,
    fullName: string,
    phone: string,
    address: string,
    IsRegister: boolean,
    password?: string
}

export interface InvoiceResponseCheckResult {
    message: string,
    succeeded: boolean,
    data: {
        isPassword: boolean,
        token: string
    },
    code: number,
}

export interface InvoiceResponseConfirmResult {
    message: string,
    succeeded: boolean,
    data: string,
    code: number,
}




//// BE //////////////////////////////////////

export interface InvoiceResponse {
    message: string | null;
    succeeded: boolean;
    data: InvoiceData;
    code: number;
}

export interface InvoiceData {
    invoice: InvoiceDTO;
    blockchainLatestHashOnChain: string;
    isBlockchainMatched: boolean;
}
export interface InvoiceDTO {
    amount: number;
    custemerId: string;
    customer: Customer;
    packageId: string;
    package: Package;
    dueDate: string;
    note: string | null;
    status: number;
    lastModified: string;
    blockchainHash: string;
    blockchainTxHash: string;
    blockchainRecordedAt: string;
    createdBy: string | null;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    isDeleted: boolean;
    id: string;
}


export interface Customer {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    createdBy: string | null;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    isDeleted: boolean;
    id: string;
}

export interface Package {
    packageName: string;
    price: number;
    description: string;
    durationMonths: number;
    categoryId: string;
    category: any | null;
    createdBy: string | null;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string | null;
    isDeleted: boolean;
    id: string;
}

export interface InvoiceHistoryResponse {
    message: string | null;
    succeeded: boolean;
    data: InvoiceData[];
    code: number;
}



/// request-history-token


export interface InvoiceCheckHistoryRequest {
    email: string,
    phone: string,
}

export interface InvoiceCheckHistoryResponse {
    message: string,
    succeeded: boolean,
    data: boolean,
    code: number,
}


// Response-Report-for-Admin
export interface ReportAdminResponse {
    message: string,
    succeeded: boolean,
    data: boolean,
    code: number,
}
