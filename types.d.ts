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
