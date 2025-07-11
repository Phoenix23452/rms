
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrdersTabsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  children: React.ReactNode;
}

const OrdersTabs = ({ activeFilter, setActiveFilter, children }: OrdersTabsProps) => {
  const getTabTitle = (filter: string): string => {
    switch (filter) {
      case "all": return "All Orders";
      case "pending": return "Pending Orders";
      case "confirmed": return "Confirmed Orders";
      case "out_for_delivery": return "Out For Delivery Orders";
      case "completed": return "Completed Orders";
      case "delivery": return "Delivery Orders";
      case "pickup": return "Pickup Orders";
      case "dine-in": return "Dine-in Orders";
      case "paid": return "Paid Orders";
      case "cod": return "Cash On Delivery Orders";
      default: return "Orders";
    }
  };

  return (
    <div className="border-b border-gray-200">
      <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <TabsList className="bg-transparent h-auto flex flex-wrap p-0 justify-start gap-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">All Orders</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">Pending Orders</TabsTrigger>
          <TabsTrigger value="confirmed" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">Confirmed Orders</TabsTrigger>
          <TabsTrigger value="out_for_delivery" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">Out For Delivery Orders</TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">Completed Orders</TabsTrigger>
          <TabsTrigger value="delivery" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">Delivery</TabsTrigger>
          <TabsTrigger value="pickup" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">Pickup</TabsTrigger>
          <TabsTrigger value="dine-in" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">Dine-in</TabsTrigger>
          <TabsTrigger value="paid" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">Paid</TabsTrigger>
          <TabsTrigger value="cod" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-t-md rounded-b-none px-4 py-2 text-sm">COD</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="mt-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle>
                {getTabTitle(activeFilter)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersTabs;
