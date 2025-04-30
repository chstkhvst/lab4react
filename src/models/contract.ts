import { REObject } from "./reobject";
import { User } from "./auth.models";
import { Reservation } from "./reservation";

export interface Contract {
    id: number;
    signDate: string;
    reservationId: number;
    userId: string;
    total: number; 

    object?: REObject;
    user?: User;
    reservation?: Reservation
  }
  