export class ClientProductRequest {
    pageIndex?: number | string;
    pageSize?: number | string;
    keyword?: string | string;
    categoryIds?: Array<number> | string;
    type?: string | null;
    isDiscount?: boolean | null | string;
    isHot?: boolean | null | string;
    brandId?: number | null | string;
}

export class Brand {
    id: string | undefined;
    name: string | undefined
}