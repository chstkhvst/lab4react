import { REObject } from "./reobject";
import { User } from "./auth.models";
import { Reservation } from "./reservation";

// export interface Contract {
//     id: number;
//     signDate: string;
//     reservationId: number;
//     userId: string;
//     total: number; 

//     object?: REObject;
//     user?: User;
//     reservation?: Reservation
//   }
// models/contract.ts
export interface Contract {
    id: number;
    signDate: string;
    reservationId: number;
    userId: string;
    total: number;
    reservation?: {
      id: number;
      object?: {
        id: number;
        street: string;
        building: string;
        roomnum?: string;
        square: number;
        price: number;
        dealType?: {
          id: number;
          dealName: string;
        };
        objectType?: {
          id: number;
          typeName: string;
        };
        status?: {
          id: number;
          statusName: string;
        };
      };
      resStatus?: {
        id: number;
        statusType: string;
      };
      user?: {
        id: string;
        userName: string;
        fullName?: string;
      };
    };
    user?: {
      id: string;
      userName: string;
      fullName?: string;
    };
  }