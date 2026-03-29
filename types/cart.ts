export interface CartItemResponse {
  uuid: string;
  productId: number;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  currentPrice: number;
  lineTotal: number;
  prescriptionRequired: boolean;
  nearExpiry: boolean;
  expiryDate: string;
  scheduleType: string;
  drugInteractionWarning?: string;
  priceChanged: boolean;
  addedAt: string;
}

export interface CartResponse {
  uuid: string;
  customerId: string;
  status: string;
  items: CartItemResponse[];
  itemCount: number;
  totalPrice: number;
  requiresPrescription: boolean;
  prescriptionValidated: boolean;
  prescriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CartValidationResult {
  readyForCheckout: boolean;
  issues: CartIssue[];
}

export interface CartIssue {
  itemUuid: string;
  productName: string;
  issueType: string;
  message: string;
}
