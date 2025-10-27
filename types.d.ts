type Category = {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status: boolean;
  order?: number;
  _count?: {
    products: number;
  };
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  regularPrice: number;
  discountPercentage: number;
  isFeatured: boolean;
  isPopular: boolean;
  isOptional: boolean;
  status: boolean;
  image?: string | null;
  categoryId: number;
  category?: Category;
  variants: Variant[];
  dealItems?: DealItem[];
  optionalItems?: Product[];
  usedInProducts?: Product[];
  createdAt: string;
  updatedAt: string;
};

type Variant = {
  id: number;
  name: string;
  price: number;
  productId: number;
  product?: Product;
  orderItems?: OrderItem[];
  optionalOrderItems?: OrderItem[];
};

type Deal = {
  id: number;
  name: string;
  regularPrice: number;
  offerPrice?: number | null;
  description?: string | null;
  isFeatured: boolean;
  image?: string | null;
  status: boolean;

  availableFrom?: string | null;
  availableUntil?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  availableDays: Day[]; // Enum

  dealItems?: DealItem[];

  createdAt: string;
  updatedAt: string;
};

type DealItem = {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
  note?: string | null;
  dealId: number;
  deal?: Deal;
};

type Customer = {
  id: number;
  customerCode: string;
  fullName: string;
  email: string;
  phone: string;
  joinedAt: string;
  // membershipTier: MembershipTier;
  points: number;
  about?: string | null;
  status: CustomerStatus;

  orders?: Order[];
  addresses?: Address[];
};

type Order = {
  id: number;
  customerId?: number;
  customer?: Customer;
  total: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  status: OrderStatus;
  paymentMethod: PaymentType;
  createdAt: string;
  orderType: OrderType;
  deliveryNote?: string | null;
  address?: string;
  latitude?: number;
  longitude?: number;

  items?: OrderItem[];
  timeline?: OrderTimeline[];
};

type OrderItem = {
  id?: number;
  orderId?: number;
  order?: Order;
  variantId?: number | null;
  variant?: Variant | null;
  quantity: number;
  unitPrice: number;
  price: number;
  regularPrice: number;
  discountPercentage: number;
  note?: string | null;
  optionalItems?: Variant[];
};
type CartItem = OrderItem & { product: Product };

type OrderTimeline = {
  id: number;
  orderId: number;
  order?: Order;
  status: string;
  timestamp: string;
};
type Address = {
  id: number;
  customerId: number;
  customer?: Customer;
  type: AddressType;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  deliveryNotes?: string | null;
  pinLocation: string;
};

enum Day {
  Mon = "Mon",
  Tue = "Tue",
  Wed = "Wed",
  Thu = "Thu",
  Fri = "Fri",
  Sat = "Sat",
  Sun = "Sun",
}

// enum MembershipTier {
//   BRONZE = "BRONZE",
//   SILVER = "SILVER",
//   GOLD = "GOLD",
//   PLATINUM = "PLATINUM",
// }

enum AddressType {
  HOME = "HOME",
  WORK = "WORK",
  OTHER = "OTHER",
}

enum CustomerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

enum OrderStatus {
  PLACED = "PLACED",
  CONFIRMED = "CONFIRMED",
  DISPATCHED = "DISPATCHED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

enum OrderType {
  PICKUP = "PICKUP",
  DINEIN = "DINEIN",
  DELIVERY = "DELIVERY",
}
enum PaymentType {
  MOBILE_PAYMENT = "MOBILE_PAYMENT",
  COD = "COD",
  CARD_PAYMENT = "CARD_PAYMENT",
}
