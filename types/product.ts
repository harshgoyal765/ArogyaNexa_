export type DosageForm = 'TABLET' | 'CAPSULE' | 'SYRUP' | 'INJECTION' | 'CREAM' | 'DROPS' | 'INHALER' | 'PATCH';
export type ScheduleType = 'H' | 'H1' | 'X' | 'G' | 'OTC';
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface ProductResponse {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  brandId: number;
  saltComposition: string;
  dosageForm: DosageForm;
  scheduleType: ScheduleType;
  prescriptionRequired: boolean;
  sideEffects: string;
  drugInteractions: string;
  storageCondition: string;
  usageInstructions: string;
  quantityAvailable: number;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  nearExpiry: boolean;
  expired: boolean;
  weightGrams: number;
  mrp: number;
  discountPercent: number;
  finalPrice: number;
  mainImageUrl: string;
  extraImageUrls: string[];
  status: ProductStatus;
  createdAt: string;
}

export interface ProductSearchParams {
  keyword?: string;
  categoryId?: number;
  brandId?: number;
  dosageForm?: DosageForm;
  scheduleType?: ScheduleType;
  prescriptionRequired?: boolean;
  status?: ProductStatus;
  nearExpiry?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
