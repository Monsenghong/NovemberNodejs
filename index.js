
import express, { Router } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRouter from './routes/auth.js'

const app = express()

dotenv.config()
app.use(express.json())
const connect = async ()=>{

    const connection = await mongoose.connect(process.env.MONGO_DB).catch(error=>{
        console.log(error)
    }).then(async () => {
      await console.log("DB Connection established"
        )
    })
}



app.use('/auth',authRouter)

app.use((err,req,res,next) => {

    res.status(err.status || 500).json({error:err.message})
})

app.listen(8080,() => {

    try {
        connect()
        console.log("Server is running...")

        if(process.env.NODE_ENV == 'production'){
            console.log("App is running in production mode")
        }else{
            console.log("App is running in development mode")
        }

    } catch (error) {
        console.log(error)
    }
})