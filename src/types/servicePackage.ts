

export interface ServicePackageAddRequest {
  packageName: string,
  price: number,
  description: string,
  durationMonths: number,
  categoryId: string
}

export interface ServicePackageUpdateRequest {
  id: string,
  packageName: string,
  price: number,
  description: string,
  durationMonths: number,
  categoryId: string
}

export interface ServicePackageAddResponse {
  message: string,
  succeeded: boolean,
  data: ServicePackageDTO,
  code: number,
}
export interface ServicePackageDeleteResponse {
  message: string,
  succeeded: boolean,
  data: boolean,
  code: number,
}



export interface ServicePackageResponse {
  message: string,
  succeeded: boolean,
  data: ServicePackageDTO[],
  code: number,
}

export interface ServicePackageByIdResponse {
  message: string,
  succeeded: boolean,
  data: ServicePackageDTO,
  code: number,
}

export interface ServicePackageDTO {
  id: string,
  packageName: string,
  price: number,
  description: string,
  durationMonths: number,
  categoryName: string
}