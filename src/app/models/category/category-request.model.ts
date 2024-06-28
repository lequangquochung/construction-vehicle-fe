export class CategoryRequestModel {
    name: CategoryName | undefined;
    image: string | undefined;
}

export class CategoryName {
    contentEng: string | undefined;
    contentVie: string | undefined;
}

export class CategoryTableList {
    name: CategoryName | undefined;
    image: string | undefined;
}