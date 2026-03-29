export interface AdminMetrics {
  totalSalesDaily: number;
  activeOrders: number;
  pendingPrescriptions: number;
  stockAlerts: number;
  stockAlertsCritical: number;
}

export interface RecentOrderSummary {
  id: string;
  customer: string;
  note: string;
  status: string;
  statusColor: string;
  payment: string;
  total: number;
}

export type StockLevel = 'critical' | 'warning' | 'ok';

export interface LowStockItem {
  name: string;
  remaining: number;
  level: StockLevel;
}

export interface CrmPipelineStage {
  label: string;
  count: number;
  growth: string;
  positive: boolean;
  width: string;
}

export interface CrmActivity {
  initials: string;
  name: string;
  company: string;
  action: string;
  value: string;
  time: string;
}

export interface ShipmentException {
  trackingId: string;
  destination: string;
  facility: string;
  status: string;
  issue: string;
  action: string;
}

export interface ShipmentStats {
  totalShipments: number;
  exceptions: number;
  inTransit: number;
  delayed: number;
}

export interface PlatformEvent {
  color: string;
  title: string;
  desc: string;
  time: string;
}

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
