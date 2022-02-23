const express = require('express')
const app = express()
const port = process.env.PORT||3000

const newsRouter = require('./routers/news')
const userRouter = require('./routers/user')
require('./db/mongoose')

///automatic parse
app.use(express.json())
app.use(userRouter)
app.use(newsRouter)

app.listen(port,()=>{
  console.log('Server is running')
})

