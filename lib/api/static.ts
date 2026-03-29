import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { UserProfileResponse } from '@/types/auth';
import type {
  AdminMetrics,
  RecentOrderSummary,
  LowStockItem,
  PlatformEvent,
  CrmPipelineStage,
  CrmActivity,
  ShipmentException,
  ShipmentStats,
  WellnessData,
} from '@/types/mockData';

export const staticApi = {
  getAdminMetrics: () =>
    api.get<ApiResponse<AdminMetrics>>('/api/v1/admin/metrics'),

  getRecentOrders: () =>
    api.get<ApiResponse<RecentOrderSummary[]>>('/api/v1/admin/recent-orders'),

  getLowStock: () =>
    api.get<ApiResponse<LowStockItem[]>>('/api/v1/products/low-stock'),

  getPlatformEvents: () =>
    api.get<ApiResponse<PlatformEvent[]>>('/api/v1/admin/platform-events'),

  getUsers: (params?: { page?: number; size?: number; search?: string }) =>
    api.get<ApiResponse<UserProfileResponse[]>>('/api/v1/users', { params }),

  getCrmPipeline: () =>
    api.get<ApiResponse<CrmPipelineStage[]>>('/api/v1/crm/pipeline'),

  getCrmActivities: () =>
    api.get<ApiResponse<CrmActivity[]>>('/api/v1/crm/activities'),

  getShipmentExceptions: () =>
    api.get<ApiResponse<ShipmentException[]>>('/api/v1/shipments/exceptions'),

  getShipmentStats: () =>
    api.get<ApiResponse<ShipmentStats>>('/api/v1/shipments/stats'),

  getWellness: () =>
    api.get<ApiResponse<WellnessData>>('/api/v1/users/me/wellness-score'),
};
