# Skeleton Loading - Quick Usage Guide

## Import Skeletons

```typescript
import { 
  ProductCardSkeleton,
  DashboardCardSkeleton,
  TableSkeleton,
  NotificationsSkeleton,
  ProfileSkeleton,
  // ... other skeletons
} from '@/components/ui/LoadingSpinner';
```

## Basic Pattern

```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState([]);

useEffect(() => {
  fetchData()
    .then(setData)
    .finally(() => setLoading(false));
}, []);

if (loading) {
  return <YourSkeleton />;
}

return <YourActualContent data={data} />;
```

## Common Use Cases

### 1. Product Cards
```typescript
{loading ? (
  <div className="grid grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
) : (
  <div className="grid grid-cols-3 gap-6">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </div>
)}
```

### 2. Dashboard Metrics
```typescript
{loading ? (
  <div className="grid grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <MetricCardSkeleton key={i} />
    ))}
  </div>
) : (
  <div className="grid grid-cols-4 gap-6">
    {metrics.map(m => <MetricCard key={m.id} metric={m} />)}
  </div>
)}
```

### 3. Data Tables
```typescript
{loading ? (
  <TableSkeleton rows={10} columns={5} />
) : (
  <DataTable data={data} />
)}
```

### 4. Notifications
```typescript
{loading ? (
  <NotificationsSkeleton items={8} />
) : (
  <NotificationsList notifications={notifications} />
)}
```

### 5. Profile Page
```typescript
{loading ? (
  <ProfileSkeleton />
) : (
  <ProfileContent user={user} />
)}
```

## Available Skeletons

| Skeleton | Use Case | Props |
|----------|----------|-------|
| ProductCardSkeleton | Product listings | - |
| DashboardCardSkeleton | Dashboard cards | - |
| MetricCardSkeleton | Metric/stat cards | - |
| TableSkeleton | Data tables | rows, columns |
| ListSkeleton | Lists | items |
| NotificationsSkeleton | Notifications | items |
| ProfileSkeleton | Profile pages | - |
| OrderCardSkeleton | Order cards | - |
| ArticleCardSkeleton | Article cards | - |
| ChartSkeleton | Charts/graphs | - |
| WellnessScoreSkeleton | Wellness widget | - |
| FullPageSkeleton | Full page loading | - |

## Tips

1. **Match the Layout**: Use skeletons that match your actual UI structure
2. **Use Arrays**: For multiple items, use `Array.from()` to generate skeletons
3. **Consistent Count**: Show the same number of skeletons as expected items
4. **Smooth Transitions**: Ensure no layout shift between skeleton and real content
5. **Loading State**: Always manage loading state properly with `useState`

## Example: Complete Component

```typescript
'use client';
import { useEffect, useState } from 'react';
import { ProductCardSkeleton } from '@/components/ui/LoadingSpinner';
import { productsService } from '@/lib/services';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsService.list({ page: 0, size: 12 })
      .then(({ data }) => setProducts(data.data.content))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
```

## Need a Custom Skeleton?

Create one in `components/ui/Skeletons.tsx`:

```typescript
export function MyCustomSkeleton() {
  return (
    <div className="card p-6">
      <Skeleton height="24px" width="60%" className="mb-4" />
      <Skeleton height="16px" width="100%" className="mb-2" />
      <Skeleton height="16px" width="80%" />
    </div>
  );
}
```

Then export it from `LoadingSpinner.tsx` for easy access.
