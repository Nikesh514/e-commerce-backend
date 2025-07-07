import mongoose from "mongoose";

export const connectDB = (uri:string) =>{
    mongoose.connect (uri).then(()=> {
        console.log('database connected')
    })
    .catch((err)=> {
        console.log(err)
        process.exit(1)
    })
}