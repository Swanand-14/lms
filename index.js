import dotenv from "dotenv";
import express, { urlencoded } from "express";
import morgan from "morgan";
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from "express-mongo-sanitize";
import hpp from 'hpp'
import cookieParser from "cookie-parser";
import cors from 'cors'

dotenv.config()
const app = express()
const PORT = process.env.PORT
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message:"Too many requests from this IP ,please try later"
})
app.use(helmet())
app.use(mongoSanitize())
app.use(hpp())
app.use("/api",limiter);
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true,limit:"10kb"}));
app.use(cookieParser())
app.use(cors({
    origin:process.env.CLIENT_URL || "http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE","PATCH"],
    allowedHeaders:[
         "Content-Type",     // type of data (application/json, etc.)
    "Authorization",    // JWT or Bearer tokens
    "X-Requested-With", // often used by AJAX requests
    "Accept",           // expected response format
    "Origin",           // identifies where request came from
    "Referer",          // previous page info
    "User-Agent"  
    ]
}))
app.use((err,req,res,next) => {
    res.status(err.status || 500).json({
        status:'error',
        message:err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {stack:err.stack})
    })
})
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use((req,res) => {
    res.status(404).json({
        status:"Error",message:"Route not found"
    });
})
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})
