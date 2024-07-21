export class ClientProductRequest {
    pageIndex?: number | null;
    pageSize?: number | null;
    keyword?: string | undefined;
    categoryIds!: Array<number>;
    type?: string | undefined;
    isDiscount?: boolean | undefined;
    isHot?: boolean | undefined;
    brandId?: number | undefined;
}

export class Brand {
    id: string | undefined;
    name: string | undefined
}