export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "merchant";
  created_at: string;
}

export interface Store {
  id: string;
  user_id: string;
  store_name: string;
  wilaya: string;
  whatsapp_number: string;
  logo_url?: string;
  created_at: string;
}

export interface AccountRequest {
  id: string;
  full_name: string;
  whatsapp: string;
  store_name: string;
  wilaya: string;
  monthly_orders: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface Order {
  id: string;
  store_id: string;
  customer_name: string;
  phone: string;
  product: string;
  amount: number;
  status: "pending" | "confirmed" | "cancelled" | "no_response";
  wilaya: string;
  commune?: string;
  notes?: string;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  store_id: string;
  type: "confirmation" | "cancellation" | "reminder" | "follow_up";
  content: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  store_id: string;
  key: string;
  value: string;
}

export interface OrderActivity {
  id: string;
  order_id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export type OrderStatus = "pending" | "confirmed" | "cancelled" | "no_response";

export type Language = "fr" | "ar";

export interface Translations {
  [key: string]: {
    fr: string;
    ar: string;
  };
}
