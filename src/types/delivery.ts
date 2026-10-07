export type AssignmentStatus = 'pending' | 'accepted' | 'declined';

export type DeliveryStage =
  | 'accepted'
  | 'arrived_at_restaurant'
  | 'picked_up'
  | 'arrived_at_customer'
  | 'delivered';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
  restaurant?: string;
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  payment: 'Cash on Delivery' | 'Online Payment' | 'UPI' | string;
}

export interface DeliveryOrder {
  id: string;
  items: OrderItem[];
  customer: CustomerInfo;
  grandTotal: number;
  location?: LocationCoordinates;
  restaurantName?: string;
  restaurantPhone?: string;
  restaurantLocation?: LocationCoordinates;
  restaurantAddress?: string;
  assignmentStatus: AssignmentStatus;
  deliveryStage: DeliveryStage;
  cashCollected?: boolean;
  createdAt?: string;
  distanceKm?: number;
  estimatedEarning?: number;
}

export interface DeliveryEarnings {
  ratePerDelivery: number;
  totalDeliveries: number;
  totalEarnings: number;
  todayDeliveries: number;
  todayEarnings: number;
  weekDeliveries: number;
  weekEarnings: number;
  monthDeliveries: number;
  monthEarnings: number;
  dailyTarget: number;
  targetBonus: number;
  todayTargetHit: boolean;
  totalPaidOut: number;
  pendingAmount: number;
  codCollected: number;
  codDeposited: number;
  codBalance: number;
  codDepositHistory: Array<{
    amount: number;
    note: string;
    depositedAt: string;
  }>;
  payoutHistory: Array<{
    id: string;
    amount: number;
    note: string;
    paidAt: string;
  }>;
  history: Array<{
    id: string;
    deliveredAt: string;
    customerName: string;
    customerAddress: string;
    grandTotal: number;
    earning: number;
  }>;
}

export interface DeliveryNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type?: 'order' | 'payout' | 'system';
}

export interface DeliveryPartnerProfile {
  name: string;
  phone: string;
  vehicleType: 'Bike' | 'Scooter' | 'Electric Vehicle' | 'Bicycle';
  vehicleNumber: string;
  image?: string;
  aadharNumber: string;
  drivingLicense: string;
  kycVerified: boolean;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  upiId: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  avgRating: number;
  ratingCount: number;
}

export interface AppSettings {
  contactPhone: string;
  supportEmail?: string;
  appName?: string;
}

export interface KitItem {
  id: string;
  name: string;
  category: 'tshirt' | 'bag' | 'raincoat' | 'safety' | 'combo';
  price: number;
  originalPrice: number;
  imageEmoji: string;
  description: string;
  sizes?: string[];
  inStock: boolean;
  tag?: string;
}

export interface KitOrder {
  orderId: string;
  itemId: string;
  itemName: string;
  price: number;
  selectedSize?: string;
  paymentMethod: 'wallet' | 'upi';
  status: 'confirmed' | 'ready_at_hub' | 'collected';
  orderedAt: string;
  pickupHub: string;
}

export interface LeaderboardRider {
  rank: number;
  name: string;
  zone: string;
  deliveries: number;
  onTimePercent: number;
  rating: number;
  bonusAmount: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface DropoffProof {
  orderId: string;
  photoUrl: string;
  timestamp: string;
  notes?: string;
}
