import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import {createClient} from '@supabase/supabase-js'
import rateLimit from 'express-rate-limit'
dotenv.config()
const app = express()
const supabase = createClient(process.env.SUPABASE_URL as string,process.env.SUPABASE_KEY as string)
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
})
app.use(express.json())
app.use(helmet())
app.use(cors({
    origin: process.env.ORIGIN,
}))
app.use(rateLimiter)
app.get("/",async(req:express.Request,res:express.Response)=>{
    try{
        const {data} = await supabase
        .from('plantData')
        .select('*')
        return res.status(200).json({msg:"Data fetched successfully.",ok:true,data:data})
    }
    catch(e){
        return res.status(500).json({msg:"An error occured.",ok:false,data:null})
    }
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})