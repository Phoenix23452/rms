
import { supabase } from "@/integrations/supabase/client";

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'cash' | 'wallet' | 'bank_transfer';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  options?: Record<string, any> | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  discount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  delivery_address_id: string | null;
  delivery_option: string;
  special_instructions: string | null;
  estimated_delivery: string | null;
  placed_at: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  delivery_address?: {
    address_line: string;
    city: string;
    state: string;
    postal_code: string;
  };
  timeline?: {
    id: string;
    status: string;
    description: string | null;
    time: string;
  }[];
}

export const createOrder = async (
  order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'placed_at' | 'order_number'>, 
  items: Omit<OrderItem, 'id'>[]
): Promise<Order | null> => {
  try {
    // Generate order number format: ORD-YYMMDD-XXXX (XXXX is random)
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${year}${month}${day}-${random}`;
    
    // Create the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        ...order,
        order_number: orderNumber,
        placed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (orderError || !orderData) {
      throw new Error(orderError?.message || 'Failed to create order');
    }

    // Create order items
    const orderItems = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    // Add initial status to timeline
    const { error: timelineError } = await supabase
      .from('order_timeline')
      .insert([{
        order_id: orderData.id,
        status: 'pending',
        description: 'Order received and pending confirmation'
      }]);

    if (timelineError) {
      throw new Error(timelineError.message);
    }

    // Return the complete order
    return getOrderById(orderData.id);

  } catch (error: any) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  // Get the order
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      delivery_address:delivery_address_id (
        address_line,
        city,
        state,
        postal_code
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  // Get the order items
  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
  }
  
  // Convert the items to the correct type
  const items: OrderItem[] = itemsData ? itemsData.map(item => ({
    product_id: item.product_id || '',
    product_name: item.product_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    options: item.options as Record<string, any> | null
  })) : [];

  // Get the order timeline
  const { data: timeline, error: timelineError } = await supabase
    .from('order_timeline')
    .select('*')
    .eq('order_id', id)
    .order('time', { ascending: true });

  if (timelineError) {
    console.error('Error fetching order timeline:', timelineError);
  }

  return {
    ...order,
    items,
    timeline: timeline || []
  };
};

export const updateOrderStatus = async (id: string, status: OrderStatus, description?: string): Promise<boolean> => {
  try {
    // Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (orderError) {
      throw new Error(orderError.message);
    }

    // Add status to timeline
    const { error: timelineError } = await supabase
      .from('order_timeline')
      .insert([{
        order_id: id,
        status,
        description: description || getDefaultStatusDescription(status)
      }]);

    if (timelineError) {
      throw new Error(timelineError.message);
    }

    // Auto assign rider if status is out_for_delivery and no rider is assigned
    if (status === 'out_for_delivery') {
      // Check if order already has a rider
      const { data: existingRider } = await supabase
        .from('order_riders')
        .select('*')
        .eq('order_id', id)
        .maybeSingle();

      if (!existingRider) {
        // Get available riders
        const { data: availableRiders } = await supabase
          .from('riders')
          .select('*')
          .eq('is_active', true)
          .limit(1);

        if (availableRiders && availableRiders.length > 0) {
          // Assign first available rider
          const rider = availableRiders[0];
          
          await supabase
            .from('order_riders')
            .insert([{
              order_id: id,
              rider_id: rider.id,
              assigned_at: new Date().toISOString()
            }]);
          
          // Add assignment to order timeline
          await supabase
            .from('order_timeline')
            .insert([{
              order_id: id,
              status: 'rider_assigned',
              description: `Rider assigned automatically for delivery`
            }]);
        }
      }
    }

    // Set order to complete automatically when rider marks as delivered
    if (status === 'delivered') {
      // Update rider entry
      const { data: riderOrder } = await supabase
        .from('order_riders')
        .select('*')
        .eq('order_id', id)
        .maybeSingle();
      
      if (riderOrder) {
        await supabase
          .from('order_riders')
          .update({
            delivered_at: new Date().toISOString()
          })
          .eq('id', riderOrder.id);
      }
      
      // Automatically update admin side to show order as completed
      await supabase
        .from('order_timeline')
        .insert([{
          order_id: id,
          status: 'completed',
          description: 'Order was successfully delivered and completed'
        }]);
    }

    return true;
  } catch (error: any) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('placed_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }

  return data || [];
};

export const getOrdersByStatus = async (status: OrderStatus | OrderStatus[]): Promise<Order[]> => {
  let query = supabase
    .from('orders')
    .select('*');
  
  if (Array.isArray(status)) {
    query = query.in('status', status);
  } else {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('placed_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders by status:', error);
    throw error;
  }

  return data || [];
};

export const getRecentOrders = async (limit = 10): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('placed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }

  return data || [];
};

export const submitReview = async (
  userId: string,
  orderId: string,
  productId?: string,
  riderId?: string,
  rating: number = 5,
  comment?: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('reviews')
    .insert([{
      user_id: userId,
      order_id: orderId,
      product_id: productId,
      rider_id: riderId,
      rating,
      comment
    }]);

  if (error) {
    console.error('Error submitting review:', error);
    throw error;
  }

  return true;
};

// Helper function to get default description for status updates
function getDefaultStatusDescription(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'Order received and pending confirmation';
    case 'confirmed':
      return 'Order confirmed and being prepared in kitchen';
    case 'preparing':
      return 'Your order is being prepared in the kitchen';
    case 'ready_for_pickup':
      return 'Your order is ready for pickup';
    case 'out_for_delivery':
      return 'Your order is on the way to you';
    case 'delivered':
      return 'Your order has been delivered successfully';
    case 'cancelled':
      return 'Order has been cancelled';
    default:
      return 'Order status updated';
  }
}
