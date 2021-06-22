import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import authorsRouter from "./services/authors/index.js"

const server = express()

const port = 3000

server.use(cors())
server.use(express.json())

// ********** ENDPOINTS ***************
server.use("/authors", authorsRouter)

server.listen(port, ()=>{
    console.log("Server is running on port " + port)
})