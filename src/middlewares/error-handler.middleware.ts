import { NextFunction, Request, Response } from "express";

//custom error class
class CustomError extends Error {
    
    statusCode: number
    success:boolean= false
    status: 'error' | 'fail'

    constructor(message:string, statusCode:number){
        super(message)
        this.statusCode = statusCode
        this.success = false
        this.status = statusCode >=400 && statusCode < 500 
                        ? 'fail' : 'error'

        Error.captureStackTrace(this,CustomError)

    }
}

export const errorHandler = (err: any, req: Request, res: Response, next:NextFunction) => {

    const statusCode = res.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    const status = err.status || 'error'
    const success = err.success || false

    res.status(statusCode).json({
        message,
        success,
        status
    })

}

export default CustomError;