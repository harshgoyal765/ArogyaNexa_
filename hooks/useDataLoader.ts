import { useState, useEffect } from 'react';

interface UseDataLoaderOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: any[];
  initialData?: T;
  minLoadingTime?: number; // Minimum time to show skeleton (prevents flash)
}

export function useDataLoader<T>({
  fetchFn,
  dependencies = [],
  initialData,
  minLoadingTime = 500,
}: UseDataLoaderOptions<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchFn();
        
        // Ensure minimum loading time to prevent flash
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsed);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => {} };
}

// Hook specifically for JSON data from public folder
export function useJsonData<T>(path: string, minLoadingTime = 500) {
  return useDataLoader<T>({
    fetchFn: async () => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      return response.json();
    },
    dependencies: [path],
    minLoadingTime,
  });
}
