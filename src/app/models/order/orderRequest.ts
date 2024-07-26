export class OrderRequest {
    keyword?: string | undefined;
    status?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    pageIndex?: number | undefined;
    pageSize?: number | undefined;
}