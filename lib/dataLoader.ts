/**
 * Data Loader Utility
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized data loading from JSON files in /public/data/
 * 
 * Usage:
 *   import { loadProducts, loadOrders } from '@/lib/dataLoader';
 *   const products = await loadProducts();
 *   const orders = await loadOrders();
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { ProductResponse } from '@/types/product';
import type { OrderResponse } from '@/types/order';
import type { CartResponse } from '@/types/cart';
import type { UserProfileResponse } from '@/types/auth';

// Generic data loader with caching
const cache = new Map<string, any>();

async function loadData<T>(filename: string, useCache = true): Promise<T> {
  // Check cache first
  if (useCache && cache.has(filename)) {
    return cache.get(filename);
  }

  try {
    const res = await fetch(`/data/${filename}`);
    
    if (!res.ok) {
      throw new Error(`Failed to load ${filename}: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    // Cache the result
    if (useCache) {
      cache.set(filename, data);
    }

    return data;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    throw error;
  }
}

// Clear cache (useful for development/testing)
export function clearDataCache() {
  cache.clear();
}

// Clear specific cache entry
export function clearCacheEntry(filename: string) {
  cache.delete(filename);
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function loadProducts(): Promise<ProductResponse[]> {
  return loadData<ProductResponse[]>('products.json');
}

export async function loadProductById(id: number): Promise<ProductResponse | undefined> {
  const products = await loadProducts();
  return products.find(p => p.id === id);
}

export async function loadProductBySlug(slug: string): Promise<ProductResponse | undefined> {
  const products = await loadProducts();
  return products.find(p => p.slug === slug);
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function loadOrders(): Promise<OrderResponse[]> {
  return loadData<OrderResponse[]>('orders.json');
}

export async function loadOrderByUuid(uuid: string): Promise<OrderResponse | undefined> {
  const orders = await loadOrders();
  return orders.find(o => o.uuid === uuid);
}

export async function loadOrdersByCustomer(customerId: string): Promise<OrderResponse[]> {
  const orders = await loadOrders();
  return orders.filter(o => o.customerId === customerId);
}

// ─── ARTICLES ────────────────────────────────────────────────────────────────

export interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  verified: boolean;
}

export async function loadArticles(): Promise<Article[]> {
  return loadData<Article[]>('articles.json');
}

export async function loadArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await loadArticles();
  return articles.find(a => a.slug === slug);
}

export async function loadArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await loadArticles();
  return articles.filter(a => a.category === category);
}

// ─── USERS ───────────────────────────────────────────────────────────────────

export async function loadUsers(): Promise<UserProfileResponse[]> {
  return loadData<UserProfileResponse[]>('users.json');
}

export async function loadUserByUuid(uuid: string): Promise<UserProfileResponse | undefined> {
  const users = await loadUsers();
  return users.find(u => u.uuid === uuid);
}

export async function loadUsersByRole(role: string): Promise<UserProfileResponse[]> {
  const users = await loadUsers();
  return users.filter(u => u.roles.includes(role));
}

// ─── ADMIN METRICS ───────────────────────────────────────────────────────────

export interface AdminMetrics {
  totalSalesDaily: number;
  activeOrders: number;
  pendingPrescriptions: number;
  stockAlerts: number;
  stockAlertsCritical: number;
  recentOrders: Array<{
    id: string;
    customer: string;
    note: string;
    status: string;
    statusColor: string;
    payment: string;
    total: number;
  }>;
  lowStock: Array<{
    name: string;
    remaining: number;
    level: 'critical' | 'warning' | 'ok';
  }>;
}

export async function loadAdminMetrics(): Promise<AdminMetrics> {
  return loadData<AdminMetrics>('admin-metrics.json');
}

// ─── CART ────────────────────────────────────────────────────────────────────

export async function loadCart(): Promise<CartResponse> {
  return loadData<CartResponse>('cart.json');
}

// ─── PRESCRIPTIONS ───────────────────────────────────────────────────────────

export interface Prescription {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  fileUrl: string;
  notes: string;
  createdAt: string;
  pharmacistNote?: string;
}

export async function loadPrescriptions(): Promise<Prescription[]> {
  return loadData<Prescription[]>('prescriptions.json');
}

export async function loadPrescriptionById(id: string): Promise<Prescription | undefined> {
  const prescriptions = await loadPrescriptions();
  return prescriptions.find(p => p.id === id);
}

// ─── CRM PIPELINE ────────────────────────────────────────────────────────────

export interface CRMPipeline {
  label: string;
  count: number;
  growth: string;
  positive: boolean;
  width: string;
}

export async function loadCRMPipeline(): Promise<CRMPipeline[]> {
  return loadData<CRMPipeline[]>('crm-pipeline.json');
}

// ─── LOGISTICS ───────────────────────────────────────────────────────────────

export interface ShipmentException {
  trackingId: string;
  destination: string;
  facility: string;
  status: string;
  issue: string;
  action: string;
}

export async function loadShipmentExceptions(): Promise<ShipmentException[]> {
  return loadData<ShipmentException[]>('logistics.json');
}

// ─── WELLNESS ────────────────────────────────────────────────────────────────

export interface WellnessData {
  score: number;
  activityLevel: string;
  nutritionStatus: string;
  sleepQuality: string;
  upcomingRefills: Array<{
    name: string;
    daysRemaining: number;
    autoShip: boolean;
  }>;
  consultations: Array<{
    status: string;
    date: string;
    title: string;
    doctor: string;
    icon: string;
    color: string;
    bg: string;
  }>;
}

export async function loadWellnessData(): Promise<WellnessData> {
  return loadData<WellnessData>('wellness.json');
}

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  actionUrl?: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  roles?: string[];
}

export async function loadNotifications(): Promise<Notification[]> {
  return loadData<Notification[]>('notifications.json');
}

export async function loadNotificationById(id: string): Promise<Notification | undefined> {
  const notifications = await loadNotifications();
  return notifications.find(n => n.id === id);
}

export async function loadNotificationsByRole(role: string): Promise<Notification[]> {
  const notifications = await loadNotifications();
  return notifications.filter(n => !n.roles || n.roles.includes(role));
}

export async function loadUnreadNotifications(role?: string): Promise<Notification[]> {
  const notifications = await loadNotifications();
  return notifications.filter(n => {
    const roleMatch = !role || !n.roles || n.roles.includes(role);
    return !n.read && roleMatch;
  });
}

export async function getUnreadNotificationCount(role?: string): Promise<number> {
  const unread = await loadUnreadNotifications(role);
  return unread.length;
}

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Preload all data files (useful for initial page load)
 */
export async function preloadAllData() {
  try {
    await Promise.all([
      loadProducts(),
      loadOrders(),
      loadArticles(),
      loadUsers(),
      loadAdminMetrics(),
      loadNotifications(),
    ]);
    console.log('✅ All data preloaded successfully');
  } catch (error) {
    console.error('❌ Error preloading data:', error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

/**
 * Load data with retry logic
 */
export async function loadDataWithRetry<T>(
  filename: string,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await loadData<T>(filename, false);
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError || new Error(`Failed to load ${filename} after ${maxRetries} retries`);
}
