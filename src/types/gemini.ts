// types/gemini.ts
export interface GeminiResponse {
    message: string;
    succeeded: boolean;
    data: string;
    code: number;
}

export interface GeminiRequest {
    prompt: string;
}

// types/servicePackage.ts
export interface ServicePackage {
    id: string;
    packageName: string;
    price: number;
    description: string;
    durationMonths: number;
    categoryId?: string;
    category?: {
        id: string;
        name: string;
    };
}

export interface PackageResponse {
    message: string;
    succeeded: boolean;
    data: ServicePackage;
    code: number;
}