
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Package, Calendar, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StockAlert {
  id: string;
  name: string;
  category: string;
  current_stock: number;
  min_stock: number;
  unit: string;
  location: string;
  expiry_date?: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'expiring';
}

const StockAlerts = () => {
  // Fetch inventory items with low stock or expiring soon
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['stock-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*');
      
      if (error) throw error;
      
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const alertItems: StockAlert[] = [];
      
      data.forEach(item => {
        // Check for low/out of stock
        if (item.current_stock <= 0) {
          alertItems.push({
            ...item,
            alert_type: 'out_of_stock'
          });
        } else if (item.current_stock <= item.min_stock) {
          alertItems.push({
            ...item,
            alert_type: 'low_stock'
          });
        }
        
        // Check for expiring items
        if (item.expiry_date) {
          const expiryDate = new Date(item.expiry_date);
          if (expiryDate <= weekFromNow && expiryDate > now) {
            alertItems.push({
              ...item,
              alert_type: 'expiring'
            });
          }
        }
      });
      
      return alertItems;
    }
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'out_of_stock': return <Package className="w-4 h-4" />;
      case 'low_stock': return <AlertTriangle className="w-4 h-4" />;
      case 'expiring': return <Calendar className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'out_of_stock': return 'destructive';
      case 'low_stock': return 'destructive';
      case 'expiring': return 'secondary';
      default: return 'secondary';
    }
  };

  const getAlertLabel = (type: string) => {
    switch (type) {
      case 'out_of_stock': return 'Out of Stock';
      case 'low_stock': return 'Low Stock';
      case 'expiring': return 'Expiring Soon';
      default: return 'Alert';
    }
  };

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'out_of_stock': return 'bg-red-100 border-red-200';
      case 'low_stock': return 'bg-orange-100 border-orange-200';
      case 'expiring': return 'bg-yellow-100 border-yellow-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.alert_type === 'out_of_stock');
  const warningAlerts = alerts.filter(alert => alert.alert_type === 'low_stock');
  const infoAlerts = alerts.filter(alert => alert.alert_type === 'expiring');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <Package className="w-5 h-5" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{criticalAlerts.length}</div>
            <p className="text-sm text-red-600">Items out of stock</p>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              Warning Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{warningAlerts.length}</div>
            <p className="text-sm text-orange-600">Items with low stock</p>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
              <Calendar className="w-5 h-5" />
              Expiry Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">{infoAlerts.length}</div>
            <p className="text-sm text-yellow-600">Items expiring soon</p>
          </CardContent>
        </Card>
      </div>

      {/* All Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Stock Alerts
          </CardTitle>
          <CardDescription>
            Items requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert Type</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={`${alert.id}-${alert.alert_type}`} className={getPriorityColor(alert.alert_type)}>
                    <TableCell>
                      <Badge variant={getAlertVariant(alert.alert_type) as any} className="flex items-center gap-1 w-fit">
                        {getAlertIcon(alert.alert_type)}
                        {getAlertLabel(alert.alert_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{alert.name}</TableCell>
                    <TableCell>{alert.category}</TableCell>
                    <TableCell className="font-mono">
                      <span className={alert.current_stock <= 0 ? 'text-red-600 font-bold' : 
                        alert.current_stock <= alert.min_stock ? 'text-orange-600 font-bold' : ''}>
                        {alert.current_stock} {alert.unit}
                      </span>
                    </TableCell>
                    <TableCell>{alert.min_stock} {alert.unit}</TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>
                      {alert.expiry_date ? (
                        <span className={alert.alert_type === 'expiring' ? 'text-yellow-600 font-medium' : ''}>
                          {new Date(alert.expiry_date).toLocaleDateString()}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {alert.alert_type !== 'expiring' && (
                          <Button size="sm" variant="outline">
                            Reorder
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Update Stock
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-green-600">All Good!</p>
                  <p className="text-sm">No stock alerts at the moment. Your inventory levels are healthy.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Bulk actions for managing alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline">
                Generate Reorder Report
              </Button>
              <Button variant="outline">
                Create Purchase Orders
              </Button>
              <Button variant="outline">
                Export Alert List
              </Button>
              <Button variant="outline">
                Send Alert Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockAlerts;
