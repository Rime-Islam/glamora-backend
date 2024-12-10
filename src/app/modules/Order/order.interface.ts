export interface IOrderItem {
    productId: string; 
    size?: string; 
    quantity: number; 
    price: number; 
    discount: number; 
    shopId: string;
  }
  

  export interface IOrderRequest {
    items: IOrderItem[]; 
    total: number; 
    discounts: number; 
    subTotal: number; 
    paymentStatus?: "PENDING" | "COMPLETED" | "FAILED"; 
    couponId: string;
  }