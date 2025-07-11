export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string
          created_at: string | null
          id: string
          is_default: boolean | null
          postal_code: string
          state: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address_line: string
          city: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code: string
          state: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address_line?: string
          city?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code?: string
          state?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      deal_items: {
        Row: {
          created_at: string | null
          deal_id: string | null
          id: string
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "deal_items_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          created_at: string | null
          deal_price: number
          description: string | null
          ends_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          regular_price: number
          starts_at: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deal_price: number
          description?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          regular_price: number
          starts_at: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deal_price?: number
          description?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          regular_price?: number
          starts_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          created_at: string | null
          fee: number
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fee?: number
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fee?: number
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          content: string
          created_at: string | null
          id: string
          recipients: number
          sent_at: string | null
          status: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          recipients?: number
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          recipients?: number
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string | null
          error: string | null
          id: string
          recipient: string
          status: string
          subject: string
          type: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          id?: string
          recipient: string
          status: string
          subject: string
          type: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          id?: string
          recipient?: string
          status?: string
          subject?: string
          type?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string
          cost_per_unit: number
          created_at: string
          current_stock: number
          expiry_date: string | null
          id: string
          location: string
          min_stock: number
          name: string
          supplier_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          cost_per_unit?: number
          created_at?: string
          current_stock?: number
          expiry_date?: string | null
          id?: string
          location: string
          min_stock?: number
          name: string
          supplier_id?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          cost_per_unit?: number
          created_at?: string
          current_stock?: number
          expiry_date?: string | null
          id?: string
          location?: string
          min_stock?: number
          name?: string
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string | null
          id: string
          lifetime_points: number
          points: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lifetime_points?: number
          points?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lifetime_points?: number
          points?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          options: Json | null
          order_id: string | null
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          options?: Json | null
          order_id?: string | null
          product_id?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          options?: Json | null
          order_id?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_riders: {
        Row: {
          assigned_at: string | null
          delivered_at: string | null
          id: string
          order_id: string | null
          picked_up_at: string | null
          rider_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          delivered_at?: string | null
          id?: string
          order_id?: string | null
          picked_up_at?: string | null
          rider_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          delivered_at?: string | null
          id?: string
          order_id?: string | null
          picked_up_at?: string | null
          rider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_riders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_riders_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_timeline: {
        Row: {
          description: string | null
          id: string
          order_id: string | null
          status: string
          time: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          order_id?: string | null
          status: string
          time?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          order_id?: string | null
          status?: string
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_timeline_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          delivery_address_id: string | null
          delivery_fee: number
          delivery_option: string
          discount: number
          estimated_delivery: string | null
          id: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          placed_at: string | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax: number
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_address_id?: string | null
          delivery_fee?: number
          delivery_option?: string
          discount?: number
          estimated_delivery?: string | null
          id?: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax?: number
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_address_id?: string | null
          delivery_fee?: number
          delivery_option?: string
          discount?: number
          estimated_delivery?: string | null
          id?: string
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax?: number
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_cash_logs: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          id: string
          notes: string | null
          reference_id: string | null
          register_id: string | null
          shift_id: string | null
          staff_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          id?: string
          notes?: string | null
          reference_id?: string | null
          register_id?: string | null
          shift_id?: string | null
          staff_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          reference_id?: string | null
          register_id?: string | null
          shift_id?: string | null
          staff_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "pos_cash_logs_register_id_fkey"
            columns: ["register_id"]
            isOneToOne: false
            referencedRelation: "pos_registers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_cash_logs_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "pos_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_cash_logs_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_discounts: {
        Row: {
          branch_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          min_order_amount: number | null
          name: string
          requires_manager_approval: boolean | null
          type: string
          updated_at: string | null
          value: number
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          name: string
          requires_manager_approval?: boolean | null
          type: string
          updated_at?: string | null
          value: number
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          name?: string
          requires_manager_approval?: boolean | null
          type?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_discounts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_inventory: {
        Row: {
          branch_id: string | null
          current_stock: number
          id: string
          last_updated: string | null
          low_stock_threshold: number | null
          product_id: string | null
        }
        Insert: {
          branch_id?: string | null
          current_stock?: number
          id?: string
          last_updated?: string | null
          low_stock_threshold?: number | null
          product_id?: string | null
        }
        Update: {
          branch_id?: string | null
          current_stock?: number
          id?: string
          last_updated?: string | null
          low_stock_threshold?: number | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_inventory_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_inventory_transactions: {
        Row: {
          created_at: string | null
          id: string
          inventory_id: string | null
          notes: string | null
          pos_order_item_id: string | null
          quantity_change: number
          staff_id: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          notes?: string | null
          pos_order_item_id?: string | null
          quantity_change: number
          staff_id?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          notes?: string | null
          pos_order_item_id?: string | null
          quantity_change?: number
          staff_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_inventory_transactions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "pos_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_inventory_transactions_pos_order_item_id_fkey"
            columns: ["pos_order_item_id"]
            isOneToOne: false
            referencedRelation: "pos_order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_inventory_transactions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_menu_categories: {
        Row: {
          background_color: string | null
          branch_id: string | null
          category_id: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_visible: boolean | null
          text_color: string | null
        }
        Insert: {
          background_color?: string | null
          branch_id?: string | null
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean | null
          text_color?: string | null
        }
        Update: {
          background_color?: string | null
          branch_id?: string | null
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean | null
          text_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_menu_categories_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_menu_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_modifier_options: {
        Row: {
          display_order: number | null
          id: string
          is_available: boolean | null
          modifier_id: string | null
          name: string
          price_adjustment: number | null
        }
        Insert: {
          display_order?: number | null
          id?: string
          is_available?: boolean | null
          modifier_id?: string | null
          name: string
          price_adjustment?: number | null
        }
        Update: {
          display_order?: number | null
          id?: string
          is_available?: boolean | null
          modifier_id?: string | null
          name?: string
          price_adjustment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_modifier_options_modifier_id_fkey"
            columns: ["modifier_id"]
            isOneToOne: false
            referencedRelation: "pos_modifiers"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_modifiers: {
        Row: {
          branch_id: string | null
          created_at: string | null
          id: string
          is_required: boolean | null
          name: string
          type: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          name: string
          type: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_modifiers_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_order_items: {
        Row: {
          created_at: string | null
          id: string
          is_voided: boolean | null
          modifiers: Json | null
          pos_order_id: string | null
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          void_reason: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_voided?: boolean | null
          modifiers?: Json | null
          pos_order_id?: string | null
          product_id?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
          void_reason?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_voided?: boolean | null
          modifiers?: Json | null
          pos_order_id?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          void_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_order_items_pos_order_id_fkey"
            columns: ["pos_order_id"]
            isOneToOne: false
            referencedRelation: "pos_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_orders: {
        Row: {
          branch_id: string | null
          created_at: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number
          id: string
          is_printed: boolean | null
          is_voided: boolean | null
          order_number: string
          order_type: Database["public"]["Enums"]["pos_order_type"]
          payment_status:
            | Database["public"]["Enums"]["pos_payment_status"]
            | null
          shift_id: string | null
          special_instructions: string | null
          staff_id: string | null
          subtotal: number
          table_id: string | null
          tax_amount: number
          tip_amount: number
          total_amount: number
          updated_at: string | null
          void_reason: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number
          id?: string
          is_printed?: boolean | null
          is_voided?: boolean | null
          order_number: string
          order_type: Database["public"]["Enums"]["pos_order_type"]
          payment_status?:
            | Database["public"]["Enums"]["pos_payment_status"]
            | null
          shift_id?: string | null
          special_instructions?: string | null
          staff_id?: string | null
          subtotal?: number
          table_id?: string | null
          tax_amount?: number
          tip_amount?: number
          total_amount: number
          updated_at?: string | null
          void_reason?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number
          id?: string
          is_printed?: boolean | null
          is_voided?: boolean | null
          order_number?: string
          order_type?: Database["public"]["Enums"]["pos_order_type"]
          payment_status?:
            | Database["public"]["Enums"]["pos_payment_status"]
            | null
          shift_id?: string | null
          special_instructions?: string | null
          staff_id?: string | null
          subtotal?: number
          table_id?: string | null
          tax_amount?: number
          tip_amount?: number
          total_amount?: number
          updated_at?: string | null
          void_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_orders_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "pos_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_orders_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "pos_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_payments: {
        Row: {
          amount: number
          card_last_four: string | null
          created_at: string | null
          id: string
          payment_method: Database["public"]["Enums"]["pos_payment_method"]
          pos_order_id: string | null
          processed_at: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["pos_payment_status"] | null
          tip_amount: number | null
        }
        Insert: {
          amount: number
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          payment_method: Database["public"]["Enums"]["pos_payment_method"]
          pos_order_id?: string | null
          processed_at?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["pos_payment_status"] | null
          tip_amount?: number | null
        }
        Update: {
          amount?: number
          card_last_four?: string | null
          created_at?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["pos_payment_method"]
          pos_order_id?: string | null
          processed_at?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["pos_payment_status"] | null
          tip_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_payments_pos_order_id_fkey"
            columns: ["pos_order_id"]
            isOneToOne: false
            referencedRelation: "pos_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_product_modifiers: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          modifier_id: string | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          modifier_id?: string | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          modifier_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_product_modifiers_modifier_id_fkey"
            columns: ["modifier_id"]
            isOneToOne: false
            referencedRelation: "pos_modifiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_product_modifiers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_receipt_templates: {
        Row: {
          branch_id: string | null
          created_at: string | null
          font_size: number | null
          footer_text: string | null
          header_text: string | null
          id: string
          is_default: boolean | null
          logo_url: string | null
          paper_width: number | null
          template_data: Json | null
          template_name: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          font_size?: number | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          is_default?: boolean | null
          logo_url?: string | null
          paper_width?: number | null
          template_data?: Json | null
          template_name: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          font_size?: number | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          is_default?: boolean | null
          logo_url?: string | null
          paper_width?: number | null
          template_data?: Json | null
          template_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_receipt_templates_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_registers: {
        Row: {
          branch_id: string | null
          created_at: string | null
          current_cash_amount: number | null
          id: string
          is_active: boolean | null
          opening_cash_amount: number | null
          register_number: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          current_cash_amount?: number | null
          id?: string
          is_active?: boolean | null
          opening_cash_amount?: number | null
          register_number: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          current_cash_amount?: number | null
          id?: string
          is_active?: boolean | null
          opening_cash_amount?: number | null
          register_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_registers_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_shifts: {
        Row: {
          closing_cash: number | null
          created_at: string | null
          id: string
          notes: string | null
          opening_cash: number | null
          register_id: string | null
          shift_end: string | null
          shift_start: string | null
          staff_id: string | null
          status: Database["public"]["Enums"]["shift_status"] | null
          total_card_sales: number | null
          total_cash_sales: number | null
          total_refunds: number | null
          total_sales: number | null
          total_tips: number | null
          total_voids: number | null
          updated_at: string | null
        }
        Insert: {
          closing_cash?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          opening_cash?: number | null
          register_id?: string | null
          shift_end?: string | null
          shift_start?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["shift_status"] | null
          total_card_sales?: number | null
          total_cash_sales?: number | null
          total_refunds?: number | null
          total_sales?: number | null
          total_tips?: number | null
          total_voids?: number | null
          updated_at?: string | null
        }
        Update: {
          closing_cash?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          opening_cash?: number | null
          register_id?: string | null
          shift_end?: string | null
          shift_start?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["shift_status"] | null
          total_card_sales?: number | null
          total_cash_sales?: number | null
          total_refunds?: number | null
          total_sales?: number | null
          total_tips?: number | null
          total_voids?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_shifts_register_id_fkey"
            columns: ["register_id"]
            isOneToOne: false
            referencedRelation: "pos_registers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_shifts_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_staff: {
        Row: {
          branch_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          pin_hash: string
          role: Database["public"]["Enums"]["staff_role"]
          staff_code: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pin_hash: string
          role?: Database["public"]["Enums"]["staff_role"]
          staff_code: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          pin_hash?: string
          role?: Database["public"]["Enums"]["staff_role"]
          staff_code?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_staff_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_tables: {
        Row: {
          branch_id: string | null
          capacity: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_occupied: boolean | null
          section: string | null
          table_number: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          capacity?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_occupied?: boolean | null
          section?: string | null
          table_number: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          capacity?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_occupied?: boolean | null
          section?: string | null
          table_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_tables_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_tax_config: {
        Row: {
          branch_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          tax_name: string
          tax_rate: number
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          tax_name: string
          tax_rate: number
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          tax_name?: string
          tax_rate?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_tax_config_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "restaurant_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          created_at: string | null
          id: string
          name: string
          price_adjustment: number
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          price_adjustment?: number
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          price_adjustment?: number
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          is_popular: boolean | null
          is_special_deal: boolean | null
          name: string
          price: number
          sale_price: number | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_popular?: boolean | null
          is_special_deal?: boolean | null
          name: string
          price: number
          sale_price?: number | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_popular?: boolean | null
          is_special_deal?: boolean | null
          name?: string
          price?: number
          sale_price?: number | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          inventory_item_id: string
          purchase_order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_item_id: string
          purchase_order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          inventory_item_id?: string
          purchase_order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          expected_delivery: string
          id: string
          order_date: string
          order_number: string
          status: string
          supplier_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          expected_delivery: string
          id?: string
          order_date?: string
          order_number: string
          status?: string
          supplier_id: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          expected_delivery?: string
          id?: string
          order_date?: string
          order_number?: string
          status?: string
          supplier_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string | null
          id: string
          party_size: number
          reserved_date: string
          reserved_time: string
          special_requests: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          party_size: number
          reserved_date: string
          reserved_time: string
          special_requests?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          party_size?: number
          reserved_date?: string
          reserved_time?: string
          special_requests?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      restaurant_locations: {
        Row: {
          address: string
          city: string
          closes_at: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_main_branch: boolean | null
          name: string
          opens_at: string | null
          phone: string | null
          postal_code: string
          state: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          closes_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_main_branch?: boolean | null
          name: string
          opens_at?: string | null
          phone?: string | null
          postal_code: string
          state: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          closes_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_main_branch?: boolean | null
          name?: string
          opens_at?: string | null
          phone?: string | null
          postal_code?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          rating: number
          rider_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          rating: number
          rider_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          rating?: number
          rider_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      riders: {
        Row: {
          created_at: string | null
          current_latitude: number | null
          current_longitude: number | null
          id: string
          is_active: boolean | null
          last_location_update: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          is_active?: boolean | null
          last_location_update?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          is_active?: boolean | null
          last_location_update?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          base_delivery_fee: number
          close_time: string
          created_at: string | null
          fee_per_km: number
          id: string
          is_open: boolean
          logo_url: string | null
          max_delivery_distance: number
          min_order_amount: number
          open_time: string
          restaurant_name: string
          tax_percentage: number
          updated_at: string | null
        }
        Insert: {
          base_delivery_fee?: number
          close_time?: string
          created_at?: string | null
          fee_per_km?: number
          id?: string
          is_open?: boolean
          logo_url?: string | null
          max_delivery_distance?: number
          min_order_amount?: number
          open_time?: string
          restaurant_name?: string
          tax_percentage?: number
          updated_at?: string | null
        }
        Update: {
          base_delivery_fee?: number
          close_time?: string
          created_at?: string | null
          fee_per_km?: number
          id?: string
          is_open?: boolean
          logo_url?: string | null
          max_delivery_distance?: number
          min_order_amount?: number
          open_time?: string
          restaurant_name?: string
          tax_percentage?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      stock_transactions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          inventory_item_id: string
          notes: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          inventory_item_id: string
          notes?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          inventory_item_id?: string
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_transactions_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string
          contact_person: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          payment_terms: string
          phone: string
          rating: number
          updated_at: string
        }
        Insert: {
          address: string
          contact_person: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          payment_terms: string
          phone: string
          rating?: number
          updated_at?: string
        }
        Update: {
          address?: string
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          payment_terms?: string
          phone?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_settings: {
        Row: {
          created_at: string | null
          deposit_processing_fee: number | null
          enable_wallet: boolean | null
          enable_wallet_payment: boolean | null
          id: string
          max_deposit_amount: number | null
          min_deposit_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deposit_processing_fee?: number | null
          enable_wallet?: boolean | null
          enable_wallet_payment?: boolean | null
          id?: string
          max_deposit_amount?: number | null
          min_deposit_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deposit_processing_fee?: number | null
          enable_wallet?: boolean | null
          enable_wallet_payment?: boolean | null
          id?: string
          max_deposit_amount?: number | null
          min_deposit_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          status: string
          type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string
          type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string | null
          currency: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          currency?: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          currency?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_pos_staff: {
        Args: {
          p_user_id: string
          p_staff_code: string
          p_pin: string
          p_role?: Database["public"]["Enums"]["staff_role"]
          p_branch_id?: string
        }
        Returns: string
      }
      generate_pos_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      process_wallet_transaction: {
        Args: {
          p_wallet_id: string
          p_amount: number
          p_type: string
          p_description?: string
        }
        Returns: string
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready_for_pickup"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      payment_method: "credit_card" | "cash" | "wallet" | "bank_transfer"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      pos_order_type: "dine_in" | "takeaway" | "delivery"
      pos_payment_method:
        | "cash"
        | "card"
        | "split"
        | "wallet"
        | "loyalty_points"
      pos_payment_status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "voided"
      shift_status: "open" | "closed" | "suspended"
      staff_role: "cashier" | "manager" | "admin"
      transaction_type: "sale" | "refund" | "void" | "discount" | "tip"
      user_role: "customer" | "admin" | "rider"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready_for_pickup",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      payment_method: ["credit_card", "cash", "wallet", "bank_transfer"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      pos_order_type: ["dine_in", "takeaway", "delivery"],
      pos_payment_method: ["cash", "card", "split", "wallet", "loyalty_points"],
      pos_payment_status: [
        "pending",
        "completed",
        "failed",
        "refunded",
        "voided",
      ],
      shift_status: ["open", "closed", "suspended"],
      staff_role: ["cashier", "manager", "admin"],
      transaction_type: ["sale", "refund", "void", "discount", "tip"],
      user_role: ["customer", "admin", "rider"],
    },
  },
} as const
