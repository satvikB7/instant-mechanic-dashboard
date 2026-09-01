export interface DashboardSummary {
  totalBookings: number;
  totalCustomers: number;
  activeMechanics: number;
  totalRevenue: number;
}

export interface BookingOverTime {
  date: string;
  bookings: number;
}

export interface ServiceBreakdown {
  service: string;
  bookings: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface RecentBooking {
  id: number;
  customer: string;
  vehicle: string;
  service: string;
  mechanic: string | null;
  status: string;
  amount: number;
  scheduledAt: string;
}

export interface MechanicWorkload {
  id: number;
  mechanic: string;
  assignedJobs: number;
  completedJobs: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  bookingsOverTime: BookingOverTime[];
  serviceBreakdown: ServiceBreakdown[];
  statusDistribution: StatusDistribution[];
  recentBookings: RecentBooking[];
  mechanicWorkload: MechanicWorkload[];
}