
const mongoose = require('mongoose')

const mongoURI = "mongodb+srv://digraprince7:ztuvrtOaG1HwVyT2@apnaai.tdnw4ck.mongodb.net/?retryWrites=true&w=majority"
const connectToMongo = async () => {
    // mongoose.set('strictQuery', true)
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI)
        console.log('Mongo connected successfully')
    } catch (error) {
        console.log(error)
    }
}


module.exports = connectToMongo;
