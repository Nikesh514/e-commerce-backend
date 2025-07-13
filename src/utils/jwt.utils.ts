import * as jwt from "jsonwebtoken";
import { JWTPayload, JWTPayloadDecoded } from '../types/global.types'
import "dotenv/config"

// Valid formats: '60', '"2 days"', '10h', '7d'
const JWT_EXPIRES_IN = '1d'
const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'your-secret-key'

export const generateToken = (payload: JWTPayload): string => {
    const options: jwt.SignOptions = {
        expiresIn: JWT_EXPIRES_IN
    }
    return jwt.sign(payload, JWT_SECRET, options)
}

export const decodeJWTToken = (token: string): JWTPayloadDecoded => {
    return jwt.verify(token, JWT_SECRET) as JWTPayloadDecoded
}