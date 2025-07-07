import {v2 as cloudinary} from 'cloudinary';
import { IImages } from '../types/global.types';
import CustomError from '../middlewares/error-handler.middleware';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// function to delete cloudary images
export const removeImages = async (public_Ids: string[]) => {
    try {
        public_Ids.forEach(async(public_id:string)=>{
        await cloudinary.uploader.destroy(public_id)
    })  
    return true;
    } catch (error) {
    throw new CustomError('Something went wromg', 500)
    }
}

export default cloudinary