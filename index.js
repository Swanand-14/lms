import dotenv from "dotenv";
import express, { urlencoded } from "express";
import morgan from "morgan";

dotenv.config()
const app = express()
const PORT = process.env.PORT
app.use(express.json({limit:'10kb'}))
app.use(express,urlencoded({extended:true,limit:"10kb"}));
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
