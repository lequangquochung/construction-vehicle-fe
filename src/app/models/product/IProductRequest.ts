export class IProduct {
    id?: string | undefined;
    name: ProductName | undefined;
    categoryId: number | undefined;
    description: Description | undefined;
    model: string | undefined;
    contact: string | undefined;
    price: number | undefined;
    amount: number | undefined;
    type: string | undefined;
    gallery: any[] | undefined;
    status?: number | undefined;
}

export class ProductName {
    contentEng: string | undefined;
    contentVie: string | undefined;
}
export class Description {
    contentEng: string | undefined;
    contentVie: string | undefined;
}


export class BrandModel {
    id?: number | undefined;
    name: ProductName | undefined;
    categoryId: number | undefined;
}