
import jwt from 'jsonwebtoken'
import { JWTPayload, JWTPayloadDecoded } from '../types/global.types'

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || ''
const JWT_SECRET = process.env.JWT_SECRET || 'id'

export const generateToken = (payload:JWTPayload) => {

    return jwt.sign(payload,JWT_SECRET,{expiresIn:JWT_EXPIRES_IN as any})

}

export const decodeJWTToken = (token:string): JWTPayloadDecoded => {

    return jwt.verify(token,JWT_SECRET)as JWTPayloadDecoded
}