import mongoose from "mongoose";

const mongoDBConnection = async ()=>{
   mongoose.connection.on('connected', ()=>{
        console.log("DB CONNECTED")
    })

    await mongoose.connect(process.env.MONGO_URI)
}

export default mongoDBConnection;