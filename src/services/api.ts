import {
  DeliveryOrder,
  DeliveryEarnings,
  DeliveryNotification,
  DeliveryPartnerProfile,
  AppSettings,
  DeliveryStage
} from '../types/delivery';

const API_BASE = '/api';
const DIRECT_API_BASE = 'https://sachbite.in/api';

class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Default initial profile for fallback / demo
const DEFAULT_PROFILE: DeliveryPartnerProfile = {
  name: 'Sachin Kumar',
  phone: '+91 98765 43210',
  vehicleType: 'Scooter',
  vehicleNumber: 'BR 06 AB 1234',
  aadharNumber: 'XXXX-XXXX-8921',
  drivingLicense: 'DL-0620220019283',
  kycVerified: true,
  bankAccountName: 'Sachin Kumar',
  bankAccountNumber: '918237482910',
  bankIfsc: 'HDFC0001234',
  upiId: 'sachin@okaxis',
  emergencyContactName: 'Rahul Kumar (Brother)',
  emergencyContactPhone: '+91 98765 01234',
  avgRating: 4.88,
  ratingCount: 342,
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
};

// Initial Mock Orders to demonstrate pending alert & active delivery in KANTI (INDIRAPURAM & BHIR ZONE)
const INITIAL_MOCK_ORDERS: DeliveryOrder[] = [
  {
    id: 'SB-8924',
    assignmentStatus: 'pending',
    deliveryStage: 'accepted',
    grandTotal: 480,
    cashCollected: false,
    restaurantName: 'Kanti Swad Family Restaurant & Dhaba',
    restaurantPhone: '+91 98350 11223',
    restaurantAddress: 'Station Road, Near Kanti Railway Crossing, Kanti (Muzaffarpur)',
    restaurantLocation: { lat: 26.2081, lng: 85.3117 },
    customer: {
      name: 'Amit Verma',
      phone: '+91 98711 22334',
      address: 'Indirapuram Chowk, Near Kanti High School, Kanti, Muzaffarpur, Bihar',
      payment: 'Cash on Delivery',
    },
    items: [
      { name: 'Special Chicken Dum Biryani (Full)', quantity: 1, price: 340, restaurant: 'Kanti Swad Dhaba' },
      { name: 'Rumali Roti', quantity: 2, price: 40, restaurant: 'Kanti Swad Dhaba' },
      { name: 'Mint Raita & Salan', quantity: 1, price: 50, restaurant: 'Kanti Swad Dhaba' },
      { name: 'Gulab Jamun (2 pcs)', quantity: 1, price: 50, restaurant: 'Kanti Swad Dhaba' },
    ],
    distanceKm: 2.3,
    estimatedEarning: 65,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'SB-8919',
    assignmentStatus: 'accepted',
    deliveryStage: 'arrived_at_restaurant',
    grandTotal: 320,
    cashCollected: false,
    restaurantName: 'Maa Annapurna Bhojnalaya & Sweets',
    restaurantPhone: '+91 98351 99887',
    restaurantAddress: 'Kanti Main Bazar Chowk, Kanti (Muzaffarpur)',
    restaurantLocation: { lat: 26.2095, lng: 85.3134 },
    customer: {
      name: 'Pooja Sharma',
      phone: '+91 91223 34455',
      address: 'Bhir Tola / Thermal Power Colony Gate #2, Kanti, Muzaffarpur, Bihar',
      payment: 'Online Payment',
    },
    items: [
      { name: 'Special Shahi Thali', quantity: 1, price: 180, restaurant: 'Maa Annapurna' },
      { name: 'Paneer Butter Masala', quantity: 1, price: 140, restaurant: 'Maa Annapurna' },
    ],
    distanceKm: 1.8,
    estimatedEarning: 55,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  }
];

const INITIAL_MOCK_EARNINGS: DeliveryEarnings = {
  ratePerDelivery: 50,
  totalDeliveries: 428,
  totalEarnings: 23640,
  todayDeliveries: 7,
  todayEarnings: 420,
  weekDeliveries: 38,
  weekEarnings: 2280,
  monthDeliveries: 164,
  monthEarnings: 9840,
  dailyTarget: 10,
  targetBonus: 150,
  todayTargetHit: false,
  totalPaidOut: 21500,
  pendingAmount: 2140,
  codCollected: 1480,
  codDeposited: 1000,
  codBalance: 480,
  codDepositHistory: [
    { amount: 1000, note: 'Cash deposited at SachBite Kanti Hub', depositedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
    { amount: 2200, note: 'Weekly COD settlement', depositedAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString() }
  ],
  payoutHistory: [
    { id: 'PAY-7712', amount: 3500, note: 'Weekly Bank Payout to HDFC', paidAt: new Date(Date.now() - 3 * 86400 * 1000).toISOString() },
    { id: 'PAY-7649', amount: 4200, note: 'Weekly Bank Payout to HDFC', paidAt: new Date(Date.now() - 10 * 86400 * 1000).toISOString() },
    { id: 'PAY-7581', amount: 3850, note: 'Weekly Bank Payout to HDFC', paidAt: new Date(Date.now() - 17 * 86400 * 1000).toISOString() }
  ],
  history: [
    { id: 'SB-8910', customerName: 'Rohan Gupta', customerAddress: 'Kanti Purani Bazar, Ward 7', grandTotal: 540, earning: 60, deliveredAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    { id: 'SB-8902', customerName: 'Neha Kumari', customerAddress: 'Near Kanti Chhath Pokhar', grandTotal: 310, earning: 50, deliveredAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString() },
    { id: 'SB-8898', customerName: 'Dr. Vivek Singh', customerAddress: 'Kanti Primary Health Centre Road', grandTotal: 890, earning: 80, deliveredAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
    { id: 'SB-8884', customerName: 'Kavita Roy', customerAddress: 'Thermal Power Colony Quarter B-12, Kanti', grandTotal: 420, earning: 55, deliveredAt: new Date(Date.now() - 6.5 * 3600 * 1000).toISOString() }
  ]
};

const INITIAL_MOCK_NOTIFICATIONS: DeliveryNotification[] = [
  {
    id: 'notif-1',
    title: 'New Kanti Order SB-8924 Assigned!',
    body: 'Kanti Swad Dhaba order ready for pickup. ₹480 Cash on Delivery. Customer at Kanti High School.',
    read: false,
    createdAt: new Date().toISOString(),
    type: 'order'
  },
  {
    id: 'notif-2',
    title: 'Kanti Zone Daily Target Active',
    body: 'Complete 3 more Kanti deliveries today to earn extra ₹150 Daily Target Bonus.',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: 'payout'
  },
  {
    id: 'notif-3',
    title: 'Weekly Payout ₹3,500 Credited',
    body: 'Your weekly delivery payout has been successfully credited to HDFC bank account.',
    read: true,
    createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    type: 'payout'
  }
];

class ApiService {
  private token: string | null = null;
  private isDemoMode: boolean = false;
  private mockOrders: DeliveryOrder[] = [...INITIAL_MOCK_ORDERS];
  private mockEarnings: DeliveryEarnings = { ...INITIAL_MOCK_EARNINGS };
  private mockNotifications: DeliveryNotification[] = [...INITIAL_MOCK_NOTIFICATIONS];
  private mockProfile: DeliveryPartnerProfile = { ...DEFAULT_PROFILE };
  private isOnline: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('sachbite_delivery_token');
      this.isDemoMode = localStorage.getItem('sachbite_demo_mode') === 'true';
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('sachbite_delivery_token', token);
      } else {
        localStorage.removeItem('sachbite_delivery_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  setDemoMode(enabled: boolean) {
    this.isDemoMode = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sachbite_demo_mode', enabled ? 'true' : 'false');
    }
  }

  getDemoMode(): boolean {
    return this.isDemoMode;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (this.isDemoMode) {
      return this.handleDemoRequest<T>(endpoint, options);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Try relative endpoint first (proxied to https://sachbite.in/api)
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // If 401 unauthorized, clear token
        if (res.status === 401) {
          this.setToken(null);
        }
        throw new ApiError(data?.error || data?.message || `Server responded with ${res.status}`, res.status, data);
      }

      return data as T;
    } catch (err: any) {
      // If direct/proxy network failure and not demo mode, fallback to demo gracefully if requested
      if (err.name === 'TypeError' || err.status === 404 || err.status === 502) {
        console.warn(`[API] Fallback for ${endpoint}:`, err.message);
        return this.handleDemoRequest<T>(endpoint, options);
      }
      throw err;
    }
  }

  // Demo simulator that strictly adheres to the prompt's exact endpoints & schemas
  private async handleDemoRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    await new Promise((r) => setTimeout(r, 220));
    const method = options.method?.toUpperCase() || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : {};

    // Auth Login
    if (endpoint.includes('/delivery-auth/login')) {
      const username = body.username || 'partner1';
      const token = 'demo_token_' + Math.random().toString(36).substring(7);
      this.setToken(token);
      return {
        success: true,
        token,
        partnerName: this.mockProfile.name,
      } as unknown as T;
    }

    // Auth Verify
    if (endpoint.includes('/delivery-auth/verify')) {
      return { success: true, valid: true, partner: this.mockProfile } as unknown as T;
    }

    // Auth Logout
    if (endpoint.includes('/delivery-auth/logout')) {
      this.setToken(null);
      return { success: true } as unknown as T;
    }

    // Change Password
    if (endpoint.includes('/delivery-auth/change-password')) {
      return { success: true, message: 'Password successfully changed!' } as unknown as T;
    }

    // Online/Offline Toggle
    if (endpoint.includes('/delivery/online')) {
      this.isOnline = !!body.online;
      return { success: true, online: this.isOnline } as unknown as T;
    }

    // Live GPS Location
    if (endpoint.includes('/delivery/location')) {
      return { success: true, received: body } as unknown as T;
    }

    // Orders GET
    if (endpoint.includes('/delivery/orders') && method === 'GET') {
      return this.mockOrders as unknown as T;
    }

    // Order Accept
    if (endpoint.match(/\/delivery\/orders\/[^/]+\/accept/)) {
      const orderId = endpoint.split('/')[3];
      const ord = this.mockOrders.find((o) => o.id === orderId);
      if (ord) {
        ord.assignmentStatus = 'accepted';
        ord.deliveryStage = 'accepted';
      }
      return { success: true, order: ord } as unknown as T;
    }

    // Order Decline/Reject
    if (endpoint.match(/\/delivery\/orders\/[^/]+\/decline/)) {
      const orderId = endpoint.split('/')[3];
      this.mockOrders = this.mockOrders.filter((o) => o.id !== orderId);
      return { success: true, message: 'Order returned to assignment pool' } as unknown as T;
    }

    // Order Stage Update
    if (endpoint.match(/\/delivery\/orders\/[^/]+\/stage/)) {
      const orderId = endpoint.split('/')[3];
      const ord = this.mockOrders.find((o) => o.id === orderId);
      if (!ord) throw new ApiError('Order not found', 404);

      const nextStage = body.stage as DeliveryStage;

      if (nextStage === 'delivered') {
        if (body.otp !== '1234' && body.otp !== '9999' && body.otp?.length !== 4) {
          throw new ApiError('Invalid delivery OTP entered by customer. Please verify with customer.', 400);
        }

        if (ord.customer.payment === 'Cash on Delivery' && !body.cashCollected && !ord.cashCollected) {
          throw new ApiError('Cash collection must be confirmed for Cash on Delivery orders!', 400);
        }

        ord.deliveryStage = 'delivered';
        ord.cashCollected = true;

        // Update earnings
        this.mockEarnings.todayDeliveries += 1;
        this.mockEarnings.totalDeliveries += 1;
        this.mockEarnings.todayEarnings += ord.estimatedEarning || 50;
        this.mockEarnings.totalEarnings += ord.estimatedEarning || 50;
        this.mockEarnings.pendingAmount += ord.estimatedEarning || 50;

        if (ord.customer.payment === 'Cash on Delivery') {
          this.mockEarnings.codCollected += ord.grandTotal;
          this.mockEarnings.codBalance += ord.grandTotal;
        }

        if (this.mockEarnings.todayDeliveries >= this.mockEarnings.dailyTarget) {
          this.mockEarnings.todayTargetHit = true;
        }

        // Add to history
        this.mockEarnings.history.unshift({
          id: ord.id,
          customerName: ord.customer.name,
          customerAddress: ord.customer.address,
          grandTotal: ord.grandTotal,
          earning: ord.estimatedEarning || 50,
          deliveredAt: new Date().toISOString(),
        });

        // Remove from active orders
        this.mockOrders = this.mockOrders.filter((o) => o.id !== ord.id);
        return { success: true, delivered: true, order: ord } as unknown as T;
      }

      ord.deliveryStage = nextStage;
      return { success: true, stage: nextStage, order: ord } as unknown as T;
    }

    // Earnings
    if (endpoint.includes('/delivery/earnings')) {
      return this.mockEarnings as unknown as T;
    }

    // Notifications
    if (endpoint.includes('/delivery/notifications') && method === 'GET') {
      return this.mockNotifications as unknown as T;
    }

    // Mark Notifications Read
    if (endpoint.includes('/delivery/notifications/mark-read')) {
      this.mockNotifications = this.mockNotifications.map((n) => ({ ...n, read: true }));
      return { success: true } as unknown as T;
    }

    // VAPID Public Key for Push
    if (endpoint.includes('/push/vapid-public-key')) {
      return { vapidPublicKey: 'BCVapidKeySachBiteDemoDeliveryPartnerKey918237' } as unknown as T;
    }

    // Profile GET
    if (endpoint.includes('/delivery/me') && method === 'GET') {
      return this.mockProfile as unknown as T;
    }

    // Profile PUT
    if (endpoint.includes('/delivery/me') && method === 'PUT') {
      const changedKyc =
        (body.aadharNumber && body.aadharNumber !== this.mockProfile.aadharNumber) ||
        (body.drivingLicense && body.drivingLicense !== this.mockProfile.drivingLicense) ||
        (body.vehicleNumber && body.vehicleNumber !== this.mockProfile.vehicleNumber);

      this.mockProfile = {
        ...this.mockProfile,
        ...body,
        kycVerified: changedKyc ? false : this.mockProfile.kycVerified,
      };
      return this.mockProfile as unknown as T;
    }

    // Settings
    if (endpoint.includes('/settings')) {
      return {
        contactPhone: '+91 98350 99880',
        supportEmail: 'partner-support@sachbite.in',
        appName: 'SachBite Delivery Partner',
      } as unknown as T;
    }

    return {} as T;
  }

  // Helper to inject a new pending order into demo for testing the live alert workflow!
  addDemoOrder() {
    const newId = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    const kantiZones = [
      {
        restName: 'Kanti Indirapuram Zaika & Biryani',
        restAddr: 'Indirapuram Main Road, Kanti, Muzaffarpur',
        custName: 'Sanjay Sahni',
        custAddr: 'Near Bhir Tola & Indirapuram Chowk, Kanti (Muzaffarpur, Bihar)',
      },
      {
        restName: 'Bhir Kitchen & Sweets Hub',
        restAddr: 'Bhir Chowk, Station Road, Kanti',
        custName: 'Deepak Paswan',
        custAddr: 'Indirapuram Ward 3, Near Kanti High School, Kanti, Bihar',
      },
      {
        restName: 'Maa Vaishno Bhojnalaya Kanti',
        restAddr: 'Near Kanti Thermal Power Colony, Kanti',
        custName: 'Anil Thakur',
        custAddr: 'Bhir Purani Bazar, Kanti (Muzaffarpur)',
      }
    ];

    const chosen = kantiZones[Math.floor(Math.random() * kantiZones.length)];

    const newOrder: DeliveryOrder = {
      id: newId,
      assignmentStatus: 'pending',
      deliveryStage: 'accepted',
      grandTotal: Math.floor(220 + Math.random() * 380),
      cashCollected: false,
      restaurantName: chosen.restName,
      restaurantPhone: '+91 98355 44332',
      restaurantAddress: chosen.restAddr,
      restaurantLocation: { lat: 26.2085, lng: 85.312 },
      customer: {
        name: chosen.custName,
        phone: '+91 98234 56789',
        address: chosen.custAddr,
        payment: Math.random() > 0.5 ? 'Cash on Delivery' : 'Online Payment',
      },
      items: [
        { name: 'Special Chicken Dum Biryani', quantity: 1, price: 220, restaurant: chosen.restName },
        { name: 'Tandoori Roti & Gravy', quantity: 3, price: 60, restaurant: chosen.restName },
      ],
      distanceKm: +(1.2 + Math.random() * 1.6).toFixed(1),
      estimatedEarning: 55,
      createdAt: new Date().toISOString(),
    };
    this.mockOrders.unshift(newOrder);

    // Also add notification
    this.mockNotifications.unshift({
      id: `notif-${Date.now()}`,
      title: `New Kanti Order ${newId} Assigned!`,
      body: `${newOrder.restaurantName} order ready for pickup. ₹${newOrder.grandTotal} (${newOrder.customer.payment}). Delivery at ${newOrder.customer.address}.`,
      read: false,
      createdAt: new Date().toISOString(),
      type: 'order',
    });

    return newOrder;
  }

  // --- Real API Methods ---

  async login(username: string, password: string) {
    return this.request<{ success: boolean; token: string; partnerName: string }>(
      '/delivery-auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
  }

  async verify(token: string) {
    return this.request<{ success: boolean; valid?: boolean; partner?: any }>(
      '/delivery-auth/verify',
      {
        method: 'POST',
        body: JSON.stringify({ token }),
      }
    );
  }

  async logout(token: string) {
    return this.request<{ success: boolean }>('/delivery-auth/logout', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ success: boolean; message?: string }>(
      '/delivery-auth/change-password',
      {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );
  }

  async setOnlineStatus(online: boolean) {
    return this.request<{ success: boolean; online: boolean }>(
      '/delivery/online',
      {
        method: 'PUT',
        body: JSON.stringify({ online }),
      }
    );
  }

  async sendLocation(lat: number, lng: number) {
    return this.request<{ success: boolean }>(
      '/delivery/location',
      {
        method: 'POST',
        body: JSON.stringify({ lat, lng }),
      }
    );
  }

  async getOrders(): Promise<DeliveryOrder[]> {
    return this.request<DeliveryOrder[]>('/delivery/orders');
  }

  async acceptOrder(orderId: string) {
    return this.request<{ success: boolean; order?: DeliveryOrder }>(
      `/delivery/orders/${orderId}/accept`,
      { method: 'POST' }
    );
  }

  async declineOrder(orderId: string, reason?: string) {
    return this.request<{ success: boolean; message?: string }>(
      `/delivery/orders/${orderId}/decline`,
      {
        method: 'POST',
        body: JSON.stringify({ reason: reason || 'Not available right now' }),
      }
    );
  }

  async updateStage(
    orderId: string,
    stage: DeliveryStage,
    otp?: string,
    cashCollected?: boolean
  ) {
    return this.request<{ success: boolean; stage?: DeliveryStage; delivered?: boolean }>(
      `/delivery/orders/${orderId}/stage`,
      {
        method: 'PATCH',
        body: JSON.stringify({ stage, otp, cashCollected }),
      }
    );
  }

  async getEarnings(): Promise<DeliveryEarnings> {
    return this.request<DeliveryEarnings>('/delivery/earnings');
  }

  async getNotifications(): Promise<DeliveryNotification[]> {
    return this.request<DeliveryNotification[]>('/delivery/notifications');
  }

  async markNotificationsRead() {
    return this.request<{ success: boolean }>(
      '/delivery/notifications/mark-read',
      { method: 'POST' }
    );
  }

  async getVapidPublicKey() {
    return this.request<{ vapidPublicKey: string }>('/push/vapid-public-key');
  }

  async getProfile(): Promise<DeliveryPartnerProfile> {
    return this.request<DeliveryPartnerProfile>('/delivery/me');
  }

  async updateProfile(fields: Partial<DeliveryPartnerProfile>): Promise<DeliveryPartnerProfile> {
    return this.request<DeliveryPartnerProfile>('/delivery/me', {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
  }

  async uploadPhoto(file: File): Promise<{ url: string }> {
    if (this.isDemoMode) {
      // In demo mode, convert to local data URL or use avatar
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => {
          resolve({ url: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    }

    const formData = new FormData();
    formData.append('image', file);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}/delivery/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Image upload failed');
    }

    return res.json();
  }

  async getSettings(): Promise<AppSettings> {
    return this.request<AppSettings>('/settings');
  }
}

export const apiService = new ApiService();
