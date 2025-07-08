import 'dotenv/config';
import helmet from 'helmet'
import express, { NextFunction, Request, Response } from 'express';
import { connectDB } from './config/db-connect';
import CustomError, { errorHandler } from './middlewares/error-handler.middleware';
import cookieParser from 'cookie-parser';
import brandRoutes from './routes/brand.routes';


//importing routes
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes'
import wishlistRoutes from './routes/wishlist.routes'

const app = express();
const PORT  = process.env.PORT || 8080;
const DB_URI = process.env.DB_URI ?? ''

// connecting database
connectDB(DB_URI);

// using middlewares
// to set security headers / removes insecure headers
app.use(helmet())
// parse req cookie
app.use(cookieParser())
// parse url-encoded data
app.use(express.urlencoded({extended:true}))
// parse json data
app.use(express.json())

app.get('/', (req, res)=>{
    res.status(200).json({
        message: 'Server is running',
    })
})

// using routes
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/brand', brandRoutes)


app.all('/{*spalt}', (req:Request, res:Response, next:NextFunction)=>{

    const message = `cannot {req.method} on ${req.url}`

    const error = new CustomError(message, 404)

    next(error)

})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

app.use(errorHandler)