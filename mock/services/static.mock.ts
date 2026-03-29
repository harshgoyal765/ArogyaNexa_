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
import { mockCall, ok } from '@/mock/engine';
import {
  MOCK_ADMIN_METRICS,
  MOCK_RECENT_ORDERS,
  MOCK_LOW_STOCK,
  MOCK_USERS,
  MOCK_PLATFORM_EVENTS,
  MOCK_CRM_PIPELINE,
  MOCK_CRM_ACTIVITIES,
  MOCK_SHIPMENT_EXCEPTIONS,
  MOCK_WELLNESS,
} from '@/lib/mockData';

export const mockStaticService = {
  getAdminMetrics: () => mockCall<AdminMetrics>(() => ok(MOCK_ADMIN_METRICS)),

  getRecentOrders: () => mockCall<RecentOrderSummary[]>(() => ok(MOCK_RECENT_ORDERS)),

  getLowStock: () => mockCall<LowStockItem[]>(() => ok(MOCK_LOW_STOCK)),

  getPlatformEvents: () => mockCall<PlatformEvent[]>(() => ok(MOCK_PLATFORM_EVENTS)),

  getUsers: (params?: { page?: number; size?: number; search?: string }) =>
    mockCall<UserProfileResponse[]>(() => {
      let users = MOCK_USERS as UserProfileResponse[];
      if (params?.search) {
        const term = params.search.toLowerCase();
        users = users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(term) ||
            user.lastName.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        );
      }
      if (params?.page !== undefined && params?.size !== undefined) {
        const start = params.page * params.size;
        users = users.slice(start, start + params.size);
      }
      return ok(users);
    }),

  getCrmPipeline: () => mockCall<CrmPipelineStage[]>(() => ok(MOCK_CRM_PIPELINE)),

  getCrmActivities: () => mockCall<CrmActivity[]>(() => ok(MOCK_CRM_ACTIVITIES)),

  getShipmentExceptions: () => mockCall<ShipmentException[]>(() => ok(MOCK_SHIPMENT_EXCEPTIONS)),

  getShipmentStats: () =>
    mockCall<ShipmentStats>(() =>
      ok({
        totalShipments: 1520,
        exceptions: MOCK_SHIPMENT_EXCEPTIONS.length,
        inTransit: 1283,
        delayed: 34,
      })
    ),

  getWellness: () => mockCall<WellnessData>(() => ok(MOCK_WELLNESS)),
};
