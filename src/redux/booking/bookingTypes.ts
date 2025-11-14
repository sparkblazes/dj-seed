export interface Booking {
  uuid: string;
  data: {
    id: number;
    customer_id: string;
    service_id: string;
    booking_date: string;
    booking_time: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    amount: number;
    payment_status: "paid" | "unpaid" | "refunded";
    notes?: string;
    created_at: string;
    updated_at: string;
  };
}

export interface BookingDropdown {
  id: number;
  title: string; // can be booking reference or customer name
}
