export class IProductRequest {
    name: ProductName| undefined;
    categoryId: string | undefined;
    description: Description | undefined;
    model: string | undefined;
    contact: string | undefined;
    price: number | undefined;
    amount: number | undefined;
    type: string | undefined;
    gallery: File[] | undefined;
}

export class ProductName {
    contentEng: string | undefined;
    contentVie: string | undefined;
}
export class Description {
    contentEng: string | undefined;
    contentVie: string | undefined;
}
