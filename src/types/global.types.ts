
import { Schema, Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum OrderStatus {
    PENDING = "Pending",
    PROCESSING = "Processing",
    SHIPPED = "Shipped",
    CANCELED = "Canceled",
    COMPLETED = "Completed"
}

export const onlyAdmin = [Role.ADMIN]
export const onlyUser = [Role.USER]
export const onlyAdminAndUser = [Role.ADMIN, Role.USER]

export  interface IImages{
    path: string;
    public_id:string;
    _id?: Schema.Types.ObjectId
}

export interface JWTPayload {
   _id: Types.ObjectId;
    role: Role;
    email: string;
    full_Name: string;
}


export interface JWTPayloadDecoded {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
  }
  