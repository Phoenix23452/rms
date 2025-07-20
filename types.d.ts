type Category = {
  id: number;
  name: string;
  slug: string;
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
  discountPercentage?: number | null;
  isFeatured: boolean;
  isPopular: boolean;
  status: boolean;
  image?: string | null;
  categoryId: number;
  category?: Category;
  variants?: Variant[];
  dealItems?: DealItem[];
  createdAt: string;
  updatedAt: string;
};

type Variant = {
  id: number;
  name: string;
  price: number;
  productId: number;
  product?: Product;
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

enum Day {
  Mon = "Mon",
  Tue = "Tue",
  Wed = "Wed",
  Thu = "Thu",
  Fri = "Fri",
  Sat = "Sat",
  Sun = "Sun",
}
