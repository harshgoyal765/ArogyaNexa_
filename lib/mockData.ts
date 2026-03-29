/**
 * MOCK DATA — ArogyaNexa
 * ─────────────────────────────────────────────────────────────────────────────
 * All values below are sourced directly from the stitch design screens.
 * To replace with live API data, swap the import in each page:
 *
 *   import { MOCK_PRODUCTS } from '@/lib/mockData';
 *   →  const { data } = await productsApi.list({ page: 0, size: 12 });
 *      const products = data.data.content;
 *
 * API base: process.env.NEXT_PUBLIC_API_BASE_URL  (default: http://localhost:8080)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { ProductResponse } from '@/types/product';
import type { OrderResponse } from '@/types/order';
import type { CartResponse } from '@/types/cart';

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
// Source: stitch/stitch/product_listing_page/code.html
// Replace with: GET /api/v1/products/search?page=0&size=12
export const MOCK_PRODUCTS: ProductResponse[] = [
  {
    id: 1, uuid: 'prod-001', name: 'Atorvastatin Calcium', slug: 'atorvastatin-calcium',
    description: "Used alongside a healthy diet to help lower 'bad' cholesterol and fats.",
    categoryId: 1, brandId: 1, saltComposition: 'Atorvastatin 20mg',
    dosageForm: 'TABLET', scheduleType: 'H', prescriptionRequired: true,
    sideEffects: 'Muscle pain, liver enzyme elevation, headache.',
    drugInteractions: 'Avoid grapefruit juice. Caution with warfarin.',
    storageCondition: 'Store below 25°C in a dry place.',
    usageInstructions: 'Take once daily in the evening with or without food.',
    quantityAvailable: 240, batchNumber: 'BATCH-ATV-2024-01',
    manufacturingDate: '2024-01-15', expiryDate: '2026-01-15',
    nearExpiry: false, expired: false, weightGrams: 50,
    mrp: 28.00, discountPercent: 12, finalPrice: 24.50,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNJldAbMpdkNKc5OG0yrIJkUeNjRlcv-hU0eUCZO6mSzyIWeUQt-uTRRq9zPgEQOSYdeB5zsQOnQj_dRfGN3l2lEHAIs_AA9zfMWBTr2DVWbXcuFb167zJmT9XXDdntLpPlyb1ukPKw2IPYVzBade-kdm1NcPUxQjUpKp5w07MOFbY4yeMDhazGmhSEFPRa2btJ6-bOgI01pnFzQ_QvmUrMQnem2k0DhDmFiz-FwtNiSyOD_H46NhBnDj5z799spcCimFHtz8DnS0', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2, uuid: 'prod-002', name: 'Omeprazole Magnesium', slug: 'omeprazole-magnesium',
    description: 'Effective relief for frequent heartburn and acid reflux symptoms.',
    categoryId: 2, brandId: 2, saltComposition: 'Omeprazole 20mg',
    dosageForm: 'CAPSULE', scheduleType: 'OTC', prescriptionRequired: false,
    sideEffects: 'Headache, nausea, diarrhea, abdominal pain.',
    drugInteractions: 'May reduce absorption of ketoconazole and iron salts.',
    storageCondition: 'Store at room temperature away from moisture.',
    usageInstructions: 'Take 30 minutes before meals. Do not crush capsule.',
    quantityAvailable: 180, batchNumber: 'BATCH-OMP-2024-02',
    manufacturingDate: '2024-02-01', expiryDate: '2026-02-01',
    nearExpiry: false, expired: false, weightGrams: 30,
    mrp: 20.00, discountPercent: 9, finalPrice: 18.25,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHnke7qZsqgtk2FM-U3VRk7mI5k_F26e8pEVEoFjzdNSzpaDWXw-iGVA95DS9BUWlYzvk_UZH_jXpoQl93-lrPaAZOjpJK5TNT4NEoiJwQy9LbBby-rLD0wk2QBeTVFhlg9u97pTfUtyqz5ri-GVL2nZfo5S_nKvISLyeQNf11bxeV3iDxtDF6favIF65ewEOXvItSb4nlCfGoqn_KenuxJKJbCy45ml41D5TyqidTQHEvPUEybDa5PzvdMkl9eL6e2Iz_fpR1bQ0', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 3, uuid: 'prod-003', name: 'Amoxicillin Forte', slug: 'amoxicillin-forte',
    description: 'Broad-spectrum penicillin antibiotic for systemic bacterial infections.',
    categoryId: 3, brandId: 1, saltComposition: 'Amoxicillin 500mg',
    dosageForm: 'CAPSULE', scheduleType: 'H', prescriptionRequired: true,
    sideEffects: 'Diarrhea, rash, nausea, allergic reactions.',
    drugInteractions: 'Avoid with methotrexate. Reduces efficacy of oral contraceptives.',
    storageCondition: 'Store below 25°C. Keep away from children.',
    usageInstructions: 'Complete the full course. Take with or without food.',
    quantityAvailable: 8, batchNumber: 'BATCH-AMX-2024-03',
    manufacturingDate: '2024-03-01', expiryDate: '2025-03-01',
    nearExpiry: true, expired: false, weightGrams: 40,
    mrp: 35.00, discountPercent: 9, finalPrice: 32.00,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvHzcXAW_Y-gnSukOwbELqIddyLhFo0lod4Q-HikxVBICqnVrUugPObcdMsWhK1XQ8MrkDHD7TjZKaFlVoHUvSOn2Ap1jVbdTSKhMZnaZAeJasqvPaeyaZZQDirEiz4K2ZB0FgGhinH7Tws1DPymckQN_xX5wqJI19-49M77lMWcsGbE-NxEgM884Kd0jT3SmgahJelryPxKFbehYUq7b0sPLKatkqXWMI5-m-8QQXXWUkA7Z9-XMydNxJsXcVDOnveTwj4omND4', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 4, uuid: 'prod-004', name: 'Salbutamol Inhaler', slug: 'salbutamol-inhaler',
    description: 'Rapid-acting bronchodilator for management of asthma and COPD.',
    categoryId: 4, brandId: 3, saltComposition: 'Salbutamol 100mcg/dose',
    dosageForm: 'INHALER', scheduleType: 'H1', prescriptionRequired: true,
    sideEffects: 'Tremor, palpitations, headache, muscle cramps.',
    drugInteractions: 'Caution with beta-blockers and diuretics.',
    storageCondition: 'Store below 30°C. Do not puncture or incinerate.',
    usageInstructions: '1-2 puffs as needed. Max 8 puffs per day.',
    quantityAvailable: 95, batchNumber: 'BATCH-SAL-2024-04',
    manufacturingDate: '2024-04-01', expiryDate: '2026-04-01',
    nearExpiry: false, expired: false, weightGrams: 120,
    mrp: 50.00, discountPercent: 8, finalPrice: 45.99,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrKeCrctTdVM14rwscYbBKIUYpbhF7xtGgQ8K-t5fniY41uWu8MDwobGkfSpRiRNQzpy1GJktAL-3S97mHu9mzgeWqXtmtpZIpeSbpfPfIOk1qhOQAQAeToSvZ-rUp4P3RBh9zHW0PEDbVl-erB5tu9HOkjZyhoL5hlR6jqPJ0wHGakwmXU6NJDUzWZT6KbpvpKX_B8CqYjWgBkoXArwsIi1PRofEtyVSiZBxBfpZhEiEd1bdGQeG3-qWb5dzm0mSJWL6p0bbwzR8', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-04-01T10:00:00Z',
  },
  {
    id: 5, uuid: 'prod-005', name: 'Complex Vitamin D3', slug: 'complex-vitamin-d3',
    description: 'High-potency immune support supplement for daily dietary balance.',
    categoryId: 5, brandId: 2, saltComposition: 'Cholecalciferol 2000 IU',
    dosageForm: 'TABLET', scheduleType: 'OTC', prescriptionRequired: false,
    sideEffects: 'Rare at recommended doses. High doses may cause hypercalcemia.',
    drugInteractions: 'Caution with thiazide diuretics.',
    storageCondition: 'Store in a cool, dry place away from sunlight.',
    usageInstructions: 'Take 1 tablet daily with a fatty meal for best absorption.',
    quantityAvailable: 500, batchNumber: 'BATCH-VD3-2024-05',
    manufacturingDate: '2024-05-01', expiryDate: '2026-05-01',
    nearExpiry: false, expired: false, weightGrams: 25,
    mrp: 14.00, discountPercent: 11, finalPrice: 12.50,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6zttf1-55pMpaKmwfNngxy91ODdCdA8UdZRWHJdqgoMUdSBPVoKWTOUibev8Er-gp4yE1VwfJFaBX2aoT3KibCrTlLXsHGltAKjQnwEj23wH8PSHBBsOi24bjgcuhLcF_sPfYTZc4FVkbz7X6CEouzVM26EfQ7YLVdgWEx3LGQ9T9aeuCsbuvEwsaHUsHMOJNcj_eHz6Nv_8e2roplZAjnYR55HcF8mLxHp4Nd-uVA4AphjIN7nEuLISL4DW1j0xHmUvPaSs56FY', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-05-01T10:00:00Z',
  },
  {
    id: 6, uuid: 'prod-006', name: 'Precision BP Monitor', slug: 'precision-bp-monitor',
    description: 'Clinically validated automated upper arm blood pressure monitor.',
    categoryId: 6, brandId: 4, saltComposition: 'N/A — Medical Device',
    dosageForm: 'TABLET', scheduleType: 'OTC', prescriptionRequired: false,
    sideEffects: 'N/A',
    drugInteractions: 'N/A',
    storageCondition: 'Store at room temperature. Avoid extreme humidity.',
    usageInstructions: 'Sit quietly for 5 minutes before measuring. Use on bare upper arm.',
    quantityAvailable: 42, batchNumber: 'BATCH-BPM-2024-06',
    manufacturingDate: '2024-06-01', expiryDate: '2029-06-01',
    nearExpiry: false, expired: false, weightGrams: 350,
    mrp: 95.00, discountPercent: 6, finalPrice: 89.00,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnKRR4OpFsLya6PWGPAmoI4KWdiD3xwjB2MP6vrZUiEoMPXq_EU-kqkH0XQ2aO8qON2J-44DzRvwOKE47TX32EY7B3sQfBQ2tgu6tcyFgO9tPYftyhdMuBpFc0_PP26Ey94IqgVg3slIDdaowPdFsp1Igkv92w2lJSUO9eCDANSuw6pCHoN3-EH8CpFU7qBRz1rikQipwG2vtyfVG-e89MrTCYfZczZIkXRzeX8ADgorSD-n3_N6Im8UlNZmXxmyT4kRITW7Al66s', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 7, uuid: 'prod-007', name: 'Lisinopril 10mg', slug: 'lisinopril-10mg',
    description: 'ACE inhibitor for hypertension and heart failure management.',
    categoryId: 1, brandId: 1, saltComposition: 'Lisinopril 10mg',
    dosageForm: 'TABLET', scheduleType: 'H', prescriptionRequired: true,
    sideEffects: 'Dry cough, dizziness, hyperkalemia, angioedema (rare).',
    drugInteractions: 'Avoid NSAIDs and potassium supplements.',
    storageCondition: 'Store below 25°C in original packaging.',
    usageInstructions: 'Take once daily at the same time each day.',
    quantityAvailable: 160, batchNumber: 'BATCH-LIS-2024-07',
    manufacturingDate: '2024-07-01', expiryDate: '2026-07-01',
    nearExpiry: false, expired: false, weightGrams: 45,
    mrp: 22.00, discountPercent: 0, finalPrice: 22.00,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ66Nz7F5W3Fx7SL_8YKWft_PXTIH-F8Twgq-a5R8NuToQ4oKjzhs7aAK4D4uao3m4TQc9-CKVrtOYFFFt88vocSOWEiotNCZkpWnf-tperQikOTA3HuWzjI2HifIUhHoryHS0ziBruSzkmHWOezBTU3elUWsTwUsh3W4SS3D8ItIgfcfouwLN3bcOp-MqqpnpLH2dfK15Nn8nXyeuL_ERjpgjC7V7YCxkutMJfw5AJfaNogbsK-vlc9E-9Ker_cVKJPVEwPQ0dmQ', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-07-01T10:00:00Z',
  },
  {
    id: 8, uuid: 'prod-008', name: 'Advanced Omega Complex', slug: 'advanced-omega-complex',
    description: 'High-potency EPA/DHA formula for cognitive function and cardiovascular support.',
    categoryId: 5, brandId: 2, saltComposition: 'EPA 360mg + DHA 240mg per softgel',
    dosageForm: 'CAPSULE', scheduleType: 'OTC', prescriptionRequired: false,
    sideEffects: 'Fishy aftertaste, mild GI upset at high doses.',
    drugInteractions: 'May enhance anticoagulant effect of warfarin.',
    storageCondition: 'Refrigerate after opening. Keep away from heat.',
    usageInstructions: 'Take 2 softgels daily with meals.',
    quantityAvailable: 320, batchNumber: 'BATCH-OMG-2024-08',
    manufacturingDate: '2024-08-01', expiryDate: '2026-08-01',
    nearExpiry: false, expired: false, weightGrams: 80,
    mrp: 32.00, discountPercent: 11, finalPrice: 28.50,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXZr4lB-uWkLsH1755JEwgeePPZCoGoIA_FyW0Hb3ATC1dWQH8W2pefkT59ufu1i-B6KbSQp1G-BjcYkSylTEl-IDEtjZC8nCcc7oAeD2W8rTLmOXaKMg1L5YAHZc-ve6eZymj8-xs2meV7ZiugXDTHJH1IgangIo6uSZ-KB-JJJs55l0LXXX_vtHP8dxplfAyCZXOdsFF9bzSt-EfC4YbCM7ubJub2X0vEj3uM7KyW6fDD-0Me74mXdw7pFwdpEmeb_gS9J-yPd8', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-08-01T10:00:00Z',
  },
  {
    id: 9, uuid: 'prod-009', name: 'Metformin 500mg', slug: 'metformin-500mg',
    description: 'First-line oral antidiabetic for type 2 diabetes management.',
    categoryId: 7, brandId: 3, saltComposition: 'Metformin Hydrochloride 500mg',
    dosageForm: 'TABLET', scheduleType: 'H', prescriptionRequired: true,
    sideEffects: 'Nausea, diarrhea, metallic taste. Rare: lactic acidosis.',
    drugInteractions: 'Avoid with iodinated contrast media. Caution with alcohol.',
    storageCondition: 'Store below 25°C in a dry place.',
    usageInstructions: 'Take with meals to reduce GI side effects.',
    quantityAvailable: 280, batchNumber: 'BATCH-MET-2024-09',
    manufacturingDate: '2024-09-01', expiryDate: '2026-09-01',
    nearExpiry: false, expired: false, weightGrams: 55,
    mrp: 18.00, discountPercent: 0, finalPrice: 18.00,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNJldAbMpdkNKc5OG0yrIJkUeNjRlcv-hU0eUCZO6mSzyIWeUQt-uTRRq9zPgEQOSYdeB5zsQOnQj_dRfGN3l2lEHAIs_AA9zfMWBTr2DVWbXcuFb167zJmT9XXDdntLpPlyb1ukPKw2IPYVzBade-kdm1NcPUxQjUpKp5w07MOFbY4yeMDhazGmhSEFPRa2btJ6-bOgI01pnFzQ_QvmUrMQnem2k0DhDmFiz-FwtNiSyOD_H46NhBnDj5z799spcCimFHtz8DnS0', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-09-01T10:00:00Z',
  },
  {
    id: 10, uuid: 'prod-010', name: 'Cetirizine 10mg', slug: 'cetirizine-10mg',
    description: 'Non-drowsy antihistamine for allergic rhinitis and urticaria.',
    categoryId: 8, brandId: 4, saltComposition: 'Cetirizine Hydrochloride 10mg',
    dosageForm: 'TABLET', scheduleType: 'OTC', prescriptionRequired: false,
    sideEffects: 'Mild drowsiness, dry mouth, headache.',
    drugInteractions: 'Avoid alcohol. Caution with CNS depressants.',
    storageCondition: 'Store at room temperature away from moisture.',
    usageInstructions: 'Take 1 tablet once daily. Can be taken with or without food.',
    quantityAvailable: 450, batchNumber: 'BATCH-CET-2024-10',
    manufacturingDate: '2024-10-01', expiryDate: '2026-10-01',
    nearExpiry: false, expired: false, weightGrams: 20,
    mrp: 10.00, discountPercent: 0, finalPrice: 10.00,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHnke7qZsqgtk2FM-U3VRk7mI5k_F26e8pEVEoFjzdNSzpaDWXw-iGVA95DS9BUWlYzvk_UZH_jXpoQl93-lrPaAZOjpJK5TNT4NEoiJwQy9LbBby-rLD0wk2QBeTVFhlg9u97pTfUtyqz5ri-GVL2nZfo5S_nKvISLyeQNf11bxeV3iDxtDF6favIF65ewEOXvItSb4nlCfGoqn_KenuxJKJbCy45ml41D5TyqidTQHEvPUEybDa5PzvdMkl9eL6e2Iz_fpR1bQ0', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-10-01T10:00:00Z',
  },
  {
    id: 11, uuid: 'prod-011', name: 'Pantoprazole 40mg', slug: 'pantoprazole-40mg',
    description: 'Proton pump inhibitor for GERD and peptic ulcer treatment.',
    categoryId: 2, brandId: 1, saltComposition: 'Pantoprazole Sodium 40mg',
    dosageForm: 'TABLET', scheduleType: 'H', prescriptionRequired: true,
    sideEffects: 'Headache, diarrhea, nausea, abdominal pain.',
    drugInteractions: 'May reduce absorption of atazanavir and ketoconazole.',
    storageCondition: 'Store below 25°C. Protect from moisture.',
    usageInstructions: 'Take 30-60 minutes before breakfast. Swallow whole.',
    quantityAvailable: 200, batchNumber: 'BATCH-PAN-2024-11',
    manufacturingDate: '2024-11-01', expiryDate: '2026-11-01',
    nearExpiry: false, expired: false, weightGrams: 35,
    mrp: 25.00, discountPercent: 8, finalPrice: 23.00,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvHzcXAW_Y-gnSukOwbELqIddyLhFo0lod4Q-HikxVBICqnVrUugPObcdMsWhK1XQ8MrkDHD7TjZKaFlVoHUvSOn2Ap1jVbdTSKhMZnaZAeJasqvPaeyaZZQDirEiz4K2ZB0FgGhinH7Tws1DPymckQN_xX5wqJI19-49M77lMWcsGbE-NxEgM884Kd0jT3SmgahJelryPxKFbehYUq7b0sPLKatkqXWMI5-m-8QQXXWUkA7Z9-XMydNxJsXcVDOnveTwj4omND4', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-11-01T10:00:00Z',
  },
  {
    id: 12, uuid: 'prod-012', name: 'Ashwagandha KSM-66', slug: 'ashwagandha-ksm66',
    description: 'Clinically studied adaptogen for stress, cortisol, and vitality support.',
    categoryId: 5, brandId: 2, saltComposition: 'Withania somnifera root extract 600mg',
    dosageForm: 'CAPSULE', scheduleType: 'OTC', prescriptionRequired: false,
    sideEffects: 'Mild GI upset, drowsiness at high doses.',
    drugInteractions: 'Caution with immunosuppressants and thyroid medications.',
    storageCondition: 'Store in a cool, dry place away from direct sunlight.',
    usageInstructions: 'Take 1 capsule twice daily with meals.',
    quantityAvailable: 380, batchNumber: 'BATCH-ASH-2024-12',
    manufacturingDate: '2024-12-01', expiryDate: '2026-12-01',
    nearExpiry: false, expired: false, weightGrams: 60,
    mrp: 38.00, discountPercent: 5, finalPrice: 36.10,
    mainImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrKeCrctTdVM14rwscYbBKIUYpbhF7xtGgQ8K-t5fniY41uWu8MDwobGkfSpRiRNQzpy1GJktAL-3S97mHu9mzgeWqXtmtpZIpeSbpfPfIOk1qhOQAQAeToSvZ-rUp4P3RBh9zHW0PEDbVl-erB5tu9HOkjZyhoL5hlR6jqPJ0wHGakwmXU6NJDUzWZT6KbpvpKX_B8CqYjWgBkoXArwsIi1PRofEtyVSiZBxBfpZhEiEd1bdGQeG3-qWb5dzm0mSJWL6p0bbwzR8', extraImageUrls: [], status: 'ACTIVE',
    createdAt: '2024-12-01T10:00:00Z',
  },
];

// ─── ORDERS ──────────────────────────────────────────────────────────────────
// Source: stitch/stitch/customer_order_history/code.html
// Replace with: GET /api/v1/orders?page=0&size=10
export const MOCK_ORDERS: OrderResponse[] = [
  {
    uuid: 'ord-001', customerId: 'usr-001', orderNumber: 'ORD-20241024-RX882910',
    status: 'CONFIRMED', paymentStatus: 'PAID',
    items: [
      { uuid: 'item-001', productId: 1, productName: 'Atorvastatin Calcium', productSlug: 'atorvastatin-calcium', quantity: 2, unitPrice: 24.50, lineTotal: 49.00, prescriptionRequired: true, scheduleType: 'H' },
      { uuid: 'item-002', productId: 5, productName: 'Complex Vitamin D3', productSlug: 'complex-vitamin-d3', quantity: 1, unitPrice: 12.50, lineTotal: 12.50, prescriptionRequired: false, scheduleType: 'OTC' },
      { uuid: 'item-003', productId: 8, productName: 'Advanced Omega Complex', productSlug: 'advanced-omega-complex', quantity: 3, unitPrice: 28.50, lineTotal: 85.50, prescriptionRequired: false, scheduleType: 'OTC' },
    ],
    subtotal: 147.00, discountAmount: 4.50, shippingAmount: 0, totalAmount: 142.50,
    requiresPrescription: true, prescriptionVerified: true, prescriptionId: 'rx-001',
    shippingAddress: { name: 'Julian Vane', phone: '9876543210', addressLine1: '42 Marine Drive', addressLine2: 'Apt 8B', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentId: 'pay-001', paymentMethod: 'RAZORPAY', paidAt: '2024-10-24T11:30:00Z',
    notes: 'Please deliver before 6 PM.',
    statusHistory: [
      { fromStatus: undefined, toStatus: 'CREATED', changedBy: 'system', createdAt: '2024-10-24T09:00:00Z' },
      { fromStatus: 'CREATED', toStatus: 'APPROVED', changedBy: 'pharmacist', createdAt: '2024-10-24T10:00:00Z' },
      { fromStatus: 'APPROVED', toStatus: 'CONFIRMED', changedBy: 'system', reason: 'Payment verified', createdAt: '2024-10-24T11:30:00Z' },
    ],
    createdAt: '2024-10-24T09:00:00Z', updatedAt: '2024-10-24T11:30:00Z',
  },
  {
    uuid: 'ord-002', customerId: 'usr-001', orderNumber: 'ORD-20241018-RX881452',
    status: 'SHIPPED', paymentStatus: 'PAID',
    items: [
      { uuid: 'item-004', productId: 4, productName: 'Salbutamol Inhaler', productSlug: 'salbutamol-inhaler', quantity: 1, unitPrice: 45.99, lineTotal: 45.99, prescriptionRequired: true, scheduleType: 'H1' },
      { uuid: 'item-005', productId: 10, productName: 'Cetirizine 10mg', productSlug: 'cetirizine-10mg', quantity: 2, unitPrice: 10.00, lineTotal: 20.00, prescriptionRequired: false, scheduleType: 'OTC' },
      { uuid: 'item-006', productId: 11, productName: 'Pantoprazole 40mg', productSlug: 'pantoprazole-40mg', quantity: 1, unitPrice: 23.00, lineTotal: 23.00, prescriptionRequired: true, scheduleType: 'H' },
    ],
    subtotal: 88.99, discountAmount: 0, shippingAmount: 0, totalAmount: 89.00,
    requiresPrescription: true, prescriptionVerified: true, prescriptionId: 'rx-002',
    shippingAddress: { name: 'Julian Vane', phone: '9876543210', addressLine1: '42 Marine Drive', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentId: 'pay-002', paymentMethod: 'RAZORPAY', paidAt: '2024-10-18T14:00:00Z',
    statusHistory: [
      { fromStatus: undefined, toStatus: 'CREATED', changedBy: 'system', createdAt: '2024-10-18T09:00:00Z' },
      { fromStatus: 'CREATED', toStatus: 'CONFIRMED', changedBy: 'system', createdAt: '2024-10-18T14:00:00Z' },
      { fromStatus: 'CONFIRMED', toStatus: 'SHIPPED', changedBy: 'logistics', reason: 'Dispatched via FedEx Health', createdAt: '2024-10-19T08:00:00Z' },
    ],
    createdAt: '2024-10-18T09:00:00Z', updatedAt: '2024-10-19T08:00:00Z',
  },
  {
    uuid: 'ord-003', customerId: 'usr-001', orderNumber: 'ORD-20241002-RX879901',
    status: 'DELIVERED', paymentStatus: 'PAID',
    items: [
      { uuid: 'item-007', productId: 7, productName: 'Lisinopril 10mg', productSlug: 'lisinopril-10mg', quantity: 3, unitPrice: 22.00, lineTotal: 66.00, prescriptionRequired: true, scheduleType: 'H' },
      { uuid: 'item-008', productId: 9, productName: 'Metformin 500mg', productSlug: 'metformin-500mg', quantity: 4, unitPrice: 18.00, lineTotal: 72.00, prescriptionRequired: true, scheduleType: 'H' },
      { uuid: 'item-009', productId: 12, productName: 'Ashwagandha KSM-66', productSlug: 'ashwagandha-ksm66', quantity: 2, unitPrice: 36.10, lineTotal: 72.20, prescriptionRequired: false, scheduleType: 'OTC' },
    ],
    subtotal: 210.20, discountAmount: 0, shippingAmount: 0, totalAmount: 210.30,
    requiresPrescription: true, prescriptionVerified: true, prescriptionId: 'rx-003',
    shippingAddress: { name: 'Julian Vane', phone: '9876543210', addressLine1: '42 Marine Drive', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentId: 'pay-003', paymentMethod: 'UPI', paidAt: '2024-10-02T10:00:00Z',
    statusHistory: [
      { fromStatus: undefined, toStatus: 'CREATED', changedBy: 'system', createdAt: '2024-10-02T09:00:00Z' },
      { fromStatus: 'CREATED', toStatus: 'CONFIRMED', changedBy: 'system', createdAt: '2024-10-02T10:00:00Z' },
      { fromStatus: 'CONFIRMED', toStatus: 'SHIPPED', changedBy: 'logistics', createdAt: '2024-10-03T08:00:00Z' },
      { fromStatus: 'SHIPPED', toStatus: 'DELIVERED', changedBy: 'logistics', createdAt: '2024-10-04T14:30:00Z' },
    ],
    createdAt: '2024-10-02T09:00:00Z', updatedAt: '2024-10-04T14:30:00Z',
  },
  {
    uuid: 'ord-004', customerId: 'usr-001', orderNumber: 'ORD-20240915-RX875520',
    status: 'DELIVERED', paymentStatus: 'PAID',
    items: [
      { uuid: 'item-010', productId: 2, productName: 'Omeprazole Magnesium', productSlug: 'omeprazole-magnesium', quantity: 1, unitPrice: 18.25, lineTotal: 18.25, prescriptionRequired: false, scheduleType: 'OTC' },
      { uuid: 'item-011', productId: 5, productName: 'Complex Vitamin D3', productSlug: 'complex-vitamin-d3', quantity: 2, unitPrice: 12.50, lineTotal: 25.00, prescriptionRequired: false, scheduleType: 'OTC' },
    ],
    subtotal: 43.25, discountAmount: 0, shippingAmount: 1.90, totalAmount: 45.15,
    requiresPrescription: false, prescriptionVerified: false,
    shippingAddress: { name: 'Julian Vane', phone: '9876543210', addressLine1: '42 Marine Drive', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentId: 'pay-004', paymentMethod: 'COD', paidAt: '2024-09-15T16:00:00Z',
    statusHistory: [
      { fromStatus: undefined, toStatus: 'CREATED', changedBy: 'system', createdAt: '2024-09-15T09:00:00Z' },
      { fromStatus: 'CREATED', toStatus: 'CONFIRMED', changedBy: 'system', createdAt: '2024-09-15T09:30:00Z' },
      { fromStatus: 'CONFIRMED', toStatus: 'SHIPPED', changedBy: 'logistics', createdAt: '2024-09-16T08:00:00Z' },
      { fromStatus: 'SHIPPED', toStatus: 'DELIVERED', changedBy: 'logistics', createdAt: '2024-09-17T15:00:00Z' },
    ],
    createdAt: '2024-09-15T09:00:00Z', updatedAt: '2024-09-17T15:00:00Z',
  },
];

// ─── CART ─────────────────────────────────────────────────────────────────────
// Source: stitch/stitch/shopping_cart/code.html
// Replace with: GET /api/v1/cart
export const MOCK_CART: CartResponse = {
  uuid: 'cart-001', customerId: 'usr-001', status: 'ACTIVE',
  items: [
    {
      uuid: 'ci-001', productId: 1, productName: 'Atorvastatin Calcium', productSlug: 'atorvastatin-calcium',
      quantity: 2, unitPrice: 24.50, currentPrice: 24.50, lineTotal: 49.00,
      prescriptionRequired: true, nearExpiry: false, expiryDate: '2026-01-15',
      scheduleType: 'H', priceChanged: false, addedAt: '2024-10-24T09:00:00Z',
    },
    {
      uuid: 'ci-002', productId: 5, productName: 'Complex Vitamin D3', productSlug: 'complex-vitamin-d3',
      quantity: 1, unitPrice: 12.50, currentPrice: 12.50, lineTotal: 12.50,
      prescriptionRequired: false, nearExpiry: false, expiryDate: '2026-05-01',
      scheduleType: 'OTC', priceChanged: false, addedAt: '2024-10-24T09:05:00Z',
    },
    {
      uuid: 'ci-003', productId: 3, productName: 'Amoxicillin Forte', productSlug: 'amoxicillin-forte',
      quantity: 1, unitPrice: 32.00, currentPrice: 32.00, lineTotal: 32.00,
      prescriptionRequired: true, nearExpiry: true, expiryDate: '2025-03-01',
      scheduleType: 'H', drugInteractionWarning: 'May interact with Atorvastatin at high doses.',
      priceChanged: false, addedAt: '2024-10-24T09:10:00Z',
    },
  ],
  itemCount: 3, totalPrice: 93.50,
  requiresPrescription: true, prescriptionValidated: false,
  createdAt: '2024-10-24T09:00:00Z', updatedAt: '2024-10-24T09:10:00Z',
};

// ─── ADMIN DASHBOARD METRICS ──────────────────────────────────────────────────
// Source: stitch/stitch/admin_dashboard_overview/code.html
// Replace with: GET /api/v1/orders?page=0&size=5 + GET /api/v1/products?nearExpiry=true
export const MOCK_ADMIN_METRICS = {
  // Replace with: aggregate from /api/v1/orders (sum of totalAmount for today)
  totalSalesDaily: 14280.00,
  // Replace with: GET /api/v1/orders?status=CONFIRMED&page=0&size=1 → totalElements
  activeOrders: 142,
  // Replace with: GET /api/v1/prescriptions?status=PENDING&page=0&size=1 → totalElements
  pendingPrescriptions: 28,
  // Replace with: GET /api/v1/products?quantityAvailable=low → totalElements
  stockAlerts: 12,
  stockAlertsCritical: 3,
};

// Source: stitch/stitch/admin_dashboard_overview/code.html — Recent Activity table
// Replace with: GET /api/v1/orders?page=0&size=5
export const MOCK_RECENT_ORDERS = [
  { id: '#WA-92834', customer: 'Eleanor Fitzroy', note: 'Prescription #PX-102', status: 'Processing', statusColor: 'bg-secondary-container/20 text-on-secondary-container', payment: 'Insurance (Aetna)', total: 142.50 },
  { id: '#WA-92833', customer: 'Julian Vane', note: 'OTC Health Bundle', status: 'Shipped', statusColor: 'bg-blue-100 text-blue-800', payment: 'Visa •••• 4412', total: 89.00 },
  { id: '#WA-92832', customer: 'Sarah Miller', note: 'Prescription #PX-098', status: 'Delivered', statusColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', payment: 'Apple Pay', total: 24.15 },
];

// Source: stitch/stitch/admin_dashboard_overview/code.html — Inventory Health
// Replace with: GET /api/v1/products?nearExpiry=true&page=0&size=5
export const MOCK_LOW_STOCK = [
  { name: 'Amoxicillin 500mg', remaining: 8, level: 'critical' as const },
  { name: 'Albuterol Inhaler', remaining: 14, level: 'warning' as const },
  { name: 'Sermorelin 9mg', remaining: 12, level: 'critical' as const },
  { name: 'Vitamin B12 Complex', remaining: 45, level: 'critical' as const },
  { name: 'Sterile Syringes G22', remaining: 82, level: 'ok' as const },
];

// ─── USERS (Admin) ────────────────────────────────────────────────────────────
// Source: stitch/stitch/superadmin_dashboard/code.html
// Replace with: GET /api/v1/users?page=0&size=15
export const MOCK_USERS = [
  { uuid: 'usr-001', firstName: 'Julian', lastName: 'Vane', email: 'julian.vane@example.com', phone: '+919876543210', roles: ['CUSTOMER'], emailVerified: true, mfaEnabled: false, createdAt: '2024-01-15T10:00:00Z', lastLoginAt: '2024-10-24T09:00:00Z', passwordExpired: false, permissions: [] },
  { uuid: 'usr-002', firstName: 'Eleanor', lastName: 'Fitzroy', email: 'eleanor.fitzroy@example.com', phone: '+919876543211', roles: ['CUSTOMER'], emailVerified: true, mfaEnabled: true, createdAt: '2024-02-10T10:00:00Z', lastLoginAt: '2024-10-23T14:00:00Z', passwordExpired: false, permissions: [] },
  { uuid: 'usr-003', firstName: 'Sarah', lastName: 'Miller', email: 'sarah.miller@example.com', phone: '+919876543212', roles: ['PHARMACIST'], emailVerified: true, mfaEnabled: true, createdAt: '2024-03-05T10:00:00Z', lastLoginAt: '2024-10-24T08:00:00Z', passwordExpired: false, permissions: [] },
  { uuid: 'usr-004', firstName: 'Aris', lastName: 'Thorne', email: 'aris.thorne@clinicalatelier.com', phone: '+919876543213', roles: ['ADMIN'], emailVerified: true, mfaEnabled: true, createdAt: '2024-01-01T10:00:00Z', lastLoginAt: '2024-10-24T07:30:00Z', passwordExpired: false, permissions: [] },
  { uuid: 'usr-005', firstName: 'Elena', lastName: 'Rodriguez', email: 'elena.rodriguez@example.com', phone: '+919876543214', roles: ['CUSTOMER'], emailVerified: false, mfaEnabled: false, createdAt: '2024-09-20T10:00:00Z', lastLoginAt: '2024-10-20T11:00:00Z', passwordExpired: false, permissions: [] },
  { uuid: 'usr-006', firstName: 'Marcus', lastName: 'Holloway', email: 'marcus.holloway@example.com', phone: '+919876543215', roles: ['CUSTOMER'], emailVerified: true, mfaEnabled: false, createdAt: '2024-08-15T10:00:00Z', lastLoginAt: '2024-10-22T16:00:00Z', passwordExpired: false, permissions: [] },
];

// ─── PRESCRIPTIONS ────────────────────────────────────────────────────────────
// Source: stitch/stitch/verification_status_tracking/code.html
// Replace with: GET /api/v1/prescriptions
export const MOCK_PRESCRIPTIONS = [
  { id: 'RX-9921', status: 'PENDING' as const, fileUrl: '', notes: 'Dermatology Compound A-4', createdAt: new Date(Date.now() - 3600000).toISOString(), pharmacistNote: undefined },
  { id: 'RX-8840', status: 'APPROVED' as const, fileUrl: '', notes: 'Chronic Pain Management - Level 2', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), pharmacistNote: undefined },
  { id: 'RX-7712', status: 'REJECTED' as const, fileUrl: '', notes: 'Standard Health Screening', createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), pharmacistNote: 'Clinic stamp blurred on the bottom right corner. We are unable to verify the prescribing facility\'s credentials. Please re-upload a high-resolution scan or photo.' },
];

// ─── WELLNESS ARTICLES ────────────────────────────────────────────────────────
// Source: stitch/stitch/wellness_education_hub/code.html
// Replace with: GET /api/v1/articles?page=0&size=6 (when CMS API is ready)
export const MOCK_ARTICLES = [
  { slug: 'cortisol-management', category: 'Pharmacology', title: 'Advancements in Rapid Antigen Stability Testing', excerpt: 'New protocols for maintaining protein integrity during transport in variable climate conditions.', date: 'June 24, 2024', readTime: '8 Min Read', verified: true },
  { slug: 'gut-brain-axis', category: 'Bio-Tech', title: 'The Gut-Brain Axis: Emerging Clinical Evidence', excerpt: 'How microbiome diversity directly correlates with cognitive neurotransmitter synthesis and mood regulation.', date: 'June 20, 2024', readTime: '15 Min Read', verified: true },
  { slug: 'cortisol-nutrition', category: 'Endocrinology', title: 'Managing Cortisol Through Targeted Nutrition', excerpt: 'Clinical studies show specific amino acid combinations can significantly dampen adrenal stress responses.', date: 'June 18, 2024', readTime: '10 Min Read', verified: true },
  { slug: 'cardiac-precision-medicine', category: 'Cardiology', title: 'The Future of Precision Medicine in Cardiac Care', excerpt: 'Exploring how clinical genomics and personalized lifestyle data are reshaping cardiovascular health.', date: 'June 15, 2024', readTime: '12 Min Read', verified: true },
  { slug: 'sleep-hygiene', category: 'Holistic', title: 'The Circadian Blueprint: Optimizing Sleep Hygiene', excerpt: 'How light temperature and thermal regulation determine your cellular recovery cycles.', date: 'June 10, 2024', readTime: '9 Min Read', verified: true },
  { slug: 'anti-inflammatory-nutrition', category: 'Nutrition', title: 'Anti-Inflammatory Kitchen Staples', excerpt: 'The essential pantry audit for long-term metabolic health and lowered systemic inflammation.', date: 'June 5, 2024', readTime: '7 Min Read', verified: true },
];

// ─── CRM / SALES DATA ─────────────────────────────────────────────────────────
// Source: stitch/stitch/sales_crm_dashboard/code.html
// Replace with: GET /api/v1/crm/pipeline (when CRM module is ready)
export const MOCK_CRM_PIPELINE = [
  { label: 'Lead Generation', count: 1240, growth: '+12%', positive: true, width: '95%' },
  { label: 'Qualified Opportunities', count: 482, growth: '+5%', positive: true, width: '45%' },
  { label: 'Proposal Sent', count: 128, growth: '-2%', positive: false, width: '20%' },
  { label: 'Closed Deals', count: 52, growth: '+18%', positive: true, width: '12%' },
];

export const MOCK_CRM_ACTIVITIES = [
  { initials: 'JT', name: 'Julian Thorne', company: 'Global Logistics Corp', action: 'Updated proposal for Q4 fleet maintenance', value: '₹1,24,000', time: '2 hours ago' },
  { initials: 'ER', name: 'Dr. Elena Rodriguez', company: 'BioPath Labs', action: 'Purchased clinical supply batch (Urgent)', value: '₹42,500', time: '5 hours ago' },
  { initials: 'SN', name: 'Soren Nielsen', company: 'Nordic Tech', action: 'Completed loyalty onboarding milestone', value: 'GOLD TIER', time: 'Yesterday' },
];

// ─── LOGISTICS ────────────────────────────────────────────────────────────────
// Source: stitch/stitch/logistics_shipping_dashboard/code.html
// Replace with: GET /api/v1/shipments?page=0&size=10
export const MOCK_SHIPMENT_EXCEPTIONS = [
  { trackingId: '#WS-9902-11X', destination: 'Oslo, Norway', facility: 'Haukeland University Hospital', status: 'STALLED', issue: 'Customs clearance held: Documentation required', action: 'Resolve Docs' },
  { trackingId: '#WS-8821-44B', destination: 'Toronto, Canada', facility: 'Bay Street Pharmacy', status: 'TEMP BREACH', issue: 'Cold chain deviation detected (+2°C over limit)', action: 'Re-route / Recall' },
  { trackingId: '#WS-7710-92Z', destination: 'Singapore', facility: 'Changi Medical Park', status: 'LOST TRACE', issue: 'Last ping: 14h ago at HK Transfer Hub', action: 'Initiate Inquiry' },
];

// ─── SUPERADMIN PLATFORM EVENTS ───────────────────────────────────────────────
// Source: stitch/stitch/superadmin_dashboard/code.html
// Replace with: GET /api/v1/admin/platform-events (when audit log API is ready)
export const MOCK_PLATFORM_EVENTS = [
  { color: 'bg-primary', title: 'Node Deployment Success', desc: 'Asia-Pacific (Mumbai) region expansion complete.', time: '24 MIN AGO' },
  { color: 'bg-secondary', title: 'Policy Update', desc: 'Revised GDPR compliance clusters applied to APAC gateways.', time: '1 HOUR AGO' },
  { color: 'bg-tertiary', title: 'New Admin Registered', desc: 'Pharmacist role assigned to Dr. Priya Sharma.', time: '3 HOURS AGO' },
];

// ─── PATIENT WELLNESS DASHBOARD ───────────────────────────────────────────────
// Source: stitch/stitch/patient_wellness_dashboard/code.html
// Replace with: GET /api/v1/users/me/wellness-score (when wellness module is ready)
export const MOCK_WELLNESS = {
  score: 82,
  activityLevel: 'High',
  nutritionStatus: 'Optimal',
  sleepQuality: 'Improving',
  upcomingRefills: [
    { name: 'Lisinopril 10mg', daysRemaining: 5, autoShip: false },
    { name: 'Vitamin D3 2000IU', daysRemaining: 12, autoShip: true },
  ],
  consultations: [
    { status: 'Completed', date: 'Oct 24', title: 'Quarterly Wellness Review', doctor: 'Dr. Sarah Al-Farsi', icon: 'check', color: 'text-tertiary', bg: 'bg-tertiary-fixed' },
    { status: 'Upcoming', date: 'Nov 12', title: 'Nutrition Therapy Session', doctor: 'Clinical Nutritionist: Mark Wey', icon: 'calendar_today', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
  ],
};
