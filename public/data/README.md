# 📁 Data Directory

This directory contains all static/mock data for the ArogyaNexa frontend application in JSON format.

## 📋 Files Overview

| File | Description | Records | Size |
|------|-------------|---------|------|
| `products.json` | Product catalog (medicines, supplements, devices) | 12 | 5.2 KB |
| `orders.json` | Order history with tracking and payment info | 2 | 3.8 KB |
| `articles.json` | Wellness articles and medical research | 6 | 1.2 KB |
| `users.json` | User profiles (customers, pharmacists, admins) | 6 | 1.5 KB |
| `admin-metrics.json` | Dashboard metrics and analytics | 1 | 2.1 KB |
| `cart.json` | Shopping cart with items and totals | 1 | 1.8 KB |
| `prescriptions.json` | Prescription records and status | 3 | 0.8 KB |
| `crm-pipeline.json` | CRM sales pipeline data | 4 | 0.6 KB |
| `logistics.json` | Shipment tracking and exceptions | 3 | 0.9 KB |
| `wellness.json` | Patient wellness scores and consultations | 1 | 1.1 KB |
| `notifications.json` | User notifications (orders, prescriptions, alerts) | 12 | 2.4 KB |

**Total**: 11 files | ~21 KB

---

## 🔧 Usage

### Loading Data

```typescript
import { loadProducts, loadOrders, loadArticles } from '@/lib/dataLoader';

// Load products
const products = await loadProducts();

// Load specific product
const product = await loadProductById(1);

// Load orders for a customer
const orders = await loadOrdersByCustomer('usr-001');
```

### Available Functions

See `lib/dataLoader.ts` for all available functions:

- `loadProducts()` - Get all products
- `loadProductById(id)` - Get product by ID
- `loadProductBySlug(slug)` - Get product by slug
- `loadOrders()` - Get all orders
- `loadOrderByUuid(uuid)` - Get order by UUID
- `loadArticles()` - Get all articles
- `loadArticleBySlug(slug)` - Get article by slug
- `loadUsers()` - Get all users
- `loadAdminMetrics()` - Get dashboard metrics
- `loadCart()` - Get shopping cart
- `loadPrescriptions()` - Get prescriptions
- `loadCRMPipeline()` - Get CRM data
- `loadShipmentExceptions()` - Get logistics data
- `loadWellnessData()` - Get wellness scores
- `loadNotifications()` - Get all notifications
- `loadNotificationsByRole(role)` - Get notifications for specific role
- `loadUnreadNotifications(role?)` - Get unread notifications
- `getUnreadNotificationCount(role?)` - Get count of unread notifications

---

## 📝 Data Structure

### Products (`products.json`)

```json
{
  "id": 1,
  "uuid": "prod-001",
  "name": "Atorvastatin Calcium",
  "slug": "atorvastatin-calcium",
  "description": "...",
  "categoryId": 1,
  "brandId": 1,
  "dosageForm": "TABLET",
  "scheduleType": "H",
  "prescriptionRequired": true,
  "quantityAvailable": 240,
  "mrp": 28.00,
  "finalPrice": 24.50,
  "mainImageUrl": "https://...",
  "status": "ACTIVE",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Orders (`orders.json`)

```json
{
  "uuid": "ord-001",
  "customerId": "usr-001",
  "orderNumber": "ORD-20241024-RX882910",
  "status": "CONFIRMED",
  "paymentStatus": "PAID",
  "items": [...],
  "totalAmount": 142.50,
  "shippingAddress": {...},
  "createdAt": "2024-10-24T09:00:00Z"
}
```

### Notifications (`notifications.json`)

```json
{
  "id": "notif-001",
  "type": "ORDER_UPDATE",
  "title": "Order Shipped",
  "message": "Your order #WA-92834 has been shipped...",
  "timestamp": "2024-10-20T14:30:00Z",
  "read": false,
  "priority": "NORMAL",
  "actionUrl": "/orders/550e8400-e29b-41d4-a716-446655440001",
  "icon": "local_shipping",
  "iconColor": "text-primary",
  "iconBg": "bg-primary-fixed",
  "roles": ["CUSTOMER"]
}
```

### Articles (`articles.json`)

```json
{
  "slug": "cortisol-management",
  "category": "Pharmacology",
  "title": "Advancements in Rapid Antigen Stability Testing",
  "excerpt": "...",
  "date": "June 24, 2024",
  "readTime": "8 Min Read",
  "verified": true
}
```

---

## 🔄 Updating Data

### Adding New Records

1. Open the relevant JSON file
2. Add new object to the array
3. Ensure all required fields are present
4. Validate JSON syntax
5. Clear cache if needed:

```typescript
import { clearDataCache } from '@/lib/dataLoader';
clearDataCache();
```

### Modifying Existing Records

1. Find the record by ID/UUID
2. Update the fields
3. Save the file
4. Refresh the page or clear cache

### Deleting Records

1. Remove the object from the array
2. Update any references in other files
3. Save and test

---

## ✅ Validation

### JSON Syntax

All files must be valid JSON. Test with:

```bash
# Command line
node -e "console.log(JSON.parse(require('fs').readFileSync('public/data/products.json')))"

# Or use online validator
# https://jsonlint.com/
```

### Type Safety

All data structures match TypeScript types in:
- `types/product.ts`
- `types/order.ts`
- `types/cart.ts`
- `types/auth.ts`

---

## 🚀 Performance

### Caching

Data is automatically cached after first load. To clear:

```typescript
// Clear all cache
clearDataCache();

// Clear specific file
clearCacheEntry('products.json');
```

### Preloading

Preload all data on app start:

```typescript
import { preloadAllData } from '@/lib/dataLoader';

useEffect(() => {
  preloadAllData();
}, []);
```

---

## 🔒 Security

- ✅ No sensitive data (passwords, tokens) in JSON files
- ✅ All data is public (served from `/public/data/`)
- ✅ No PII (Personally Identifiable Information)
- ✅ Demo data only

**Note**: For production, replace with real API calls.

---

## 📊 Migration Path

### From Mock Data to Real API

1. Keep JSON files as fallback
2. Update `lib/dataLoader.ts` to call real API
3. Add error handling to fall back to JSON
4. Gradually migrate endpoints

Example:

```typescript
export async function loadProducts(): Promise<ProductResponse[]> {
  try {
    // Try real API first
    const res = await fetch('/api/v1/products');
    if (res.ok) return res.json();
  } catch (error) {
    console.warn('API failed, using fallback data');
  }
  
  // Fallback to JSON
  return loadData<ProductResponse[]>('products.json');
}
```

---

## 🐛 Troubleshooting

### File Not Found

**Error**: `Failed to load /data/products.json`

**Solution**:
1. Verify file exists in `public/data/`
2. Check file name spelling
3. Restart dev server
4. Clear browser cache

### Invalid JSON

**Error**: `Unexpected token in JSON`

**Solution**:
1. Validate JSON at https://jsonlint.com/
2. Check for trailing commas
3. Ensure proper quotes (double, not single)
4. Verify all brackets are closed

### Type Errors

**Error**: `Property 'x' does not exist on type 'Y'`

**Solution**:
1. Check TypeScript types in `types/` directory
2. Ensure JSON structure matches types
3. Add missing fields
4. Update types if needed

---

## 📚 Related Files

- `lib/dataLoader.ts` - Data loading utility
- `lib/mockData.ts` - Original mock data (deprecated)
- `lib/dummyData.ts` - Component data (deprecated)
- `DATA_TRANSFORMATION_REPORT.md` - Detailed transformation report
- `TRANSFORMATION_SUMMARY.md` - Quick reference guide

---

## 🎯 Best Practices

1. **Always validate JSON** before committing
2. **Use TypeScript types** for type safety
3. **Clear cache** after updates during development
4. **Keep data normalized** (no redundancy)
5. **Use ISO 8601** for dates (YYYY-MM-DDTHH:mm:ssZ)
6. **Maintain consistency** in naming (camelCase)
7. **Document changes** in commit messages

---

## 📞 Support

For questions or issues:
1. Check `DATA_TRANSFORMATION_REPORT.md`
2. Review `lib/dataLoader.ts` examples
3. Validate JSON syntax
4. Test in browser DevTools

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Status**: Production Ready
