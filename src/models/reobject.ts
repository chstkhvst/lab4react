export interface DealType {
        id: number;
        dealName: string;
  }

export interface ObjectType {
    id: number;
    typeName: string;
}
export interface Status {
    id: number;
    statusName: string;
}
export interface ResStatus {
    id: number;
    statusType: string;
}
export interface ObjectImages {
    id: number;
    imagePath: string;
    objectId: number;
}
export interface REObject {
    id: number;
    rooms: number;
    floors: number;
    square: number;
    street: string;
    building: number;
    roomnum?: number;
    price: number;
    dealtypeid: number;
    typeid: number;
    statusid: number;
    dealType: {
      id: number;
      dealName: string;
    };
    status: {
      id: number;
      statusName: string;
    };
    objectType: {
      id: number;
      typeName: string;
    };
    objectImages?: ObjectImages[];
  }
  export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }

