import { NextFunction, Request, Response } from "express"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.config"

export const uploader = () =>{
    const storage = new CloudinaryStorage({
      cloudinary,
      params: async () => {
        return {
          foledr: 'soft-kart',
          allowed_format: ['jpg', 'jpeg', 'webg', 'png', 'avif', 'pdf' ],
        }
      }
    })

    const upload = multer({storage })    

    return upload
}