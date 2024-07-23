
export class ICartOrderRequest {
    userId?: string | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
    note: string | undefined;
    name: string | undefined;
    details?: Array<DetailCartItem> | undefined;
}

export class DetailCartItem {
    productId: number | undefined;
    amount: number | undefined;
    price: string | undefined;
}