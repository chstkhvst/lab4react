import { REObject } from "./reobject";
import { User } from "./auth.models";

export interface ResStatus {
    id: number;
    statusType: string;
}
 
export interface Reservation {
  id: number;
  objectId: number;
  userId: string;
  startDate?: Date | string; 
  endDate?: Date | string;
  resStatusId: number;

  object?: REObject;
  resStatus?: ResStatus;
  user?: User;
}