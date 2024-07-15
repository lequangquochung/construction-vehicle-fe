export class CategoryClientRequest {
    pageIndex?: number | null;
    pageSize?: number | null;
    keyword?: string | undefined;
    categoryId!: number | null;
    type?: string | undefined;
}