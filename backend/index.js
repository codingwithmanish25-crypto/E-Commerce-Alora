import express from "express"
import cors from "cors"
import db from "./config/db.js"
import productRouter from "./routes/product.routes.js"
import dotenv from "dotenv"
import dns from "dns"

dns.setServers(["1.1.1.1","8.8.8.8"])
dotenv.config()



const app = express()
db()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/uploads', express.static('uploads'));
app.use("/api/product", productRouter)

const Port = process.env.PORT  
app.listen(Port,()=>{
    console.log(`Server is running on Port ${Port}`)
})
