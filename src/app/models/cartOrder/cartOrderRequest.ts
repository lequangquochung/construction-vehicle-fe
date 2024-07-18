
export class ICartOrderRequest {
    userId?: string | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
    note: string | undefined;
    name: string | undefined;
    details: Array<any> | undefined;
}