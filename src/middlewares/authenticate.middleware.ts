// auth middlewares

import { NextFunction, Request, Response } from "express";
import CustomError from "./error-handler.middleware";
import { decodeJWTToken } from "../utils/jwt.utils";
import User from "../models/user.model";
import { JWTPayloadDecoded, Role } from "../types/global.types";



export const authenticate = (roles?:Role[]) =>{
    return async (req:Request, res:Response, next:NextFunction) => {
        try {
            // 1. get token from req (req.cookie)
            const token = req.cookies.access_token
            console.log(token)
            if(!token){
                throw new CustomError('Unauthorized. Access denied',401)
            }

            const decodedData:JWTPayloadDecoded = decodeJWTToken(token)
            console.log(decodedData)

            if(!decodedData){
                throw new CustomError('Unauthorized. Access denied',401)
            }

            if(!decodedData.exp || decodedData.exp * 1000 > Date.now()){
                res.clearCookie('access_token', {
                    httpOnly: true
                })
                throw new CustomError('Token Expired. Access denied',401)
            }

            // ? check if user exists or not
            const user = await User.findOne({email: decodedData.email})

            if(!user){
                throw new CustomError('Unauthorized. Access denied',401)
            }
            // check if user is valid or not
            if(roles && !roles.includes(user.role)){
                throw new CustomError('Forbidden. Access denied',403)
            }

            req.user = {
                _id:user._id,
                role:user.role,
                email: user.email,
                full_Name: user.full_name
            }

            next()


        } catch (err) {
        next(err)
        }
    }
}