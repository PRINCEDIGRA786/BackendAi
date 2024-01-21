const connectToMongo = require('./db');
connectToMongo();
const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000

const cookieParser = require('cookie-parser');



app.use(cookieParser());
app.use(cors())


app.use(express.json())

//Available Routes:

app.use('/api/ques', require('./routes/ques'))
app.use('/api/auth', require('./routes/auth'))
app.use('/',(req,res)=>{
    res.json({"mesaage":"connected to server"});})



app.listen(port, () => {
    console.log(`ApnaAi app backend listening at port :  http://localhost:${port}`)
})


