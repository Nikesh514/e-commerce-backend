import { JWTPayload } from "./global.types";


declare global{
    namespace Express {
        interface Request{
            user:JWTPayload
        }
    }
}