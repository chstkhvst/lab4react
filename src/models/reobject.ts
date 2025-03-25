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

export interface REObject {
    id: number;
    rooms: number;
    floors: number;
    square: number;
    street: string;
    building: number;
    roomnum?: number;
    price: number;
    dealType: DealType;
    objectType: ObjectType;
    status: Status;
  }
  