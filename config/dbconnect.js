const mongoose=require("mongoose")
const dbConnect=()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL);
        console.log("DataBase connected Successfully ")

    }catch(error){
        console.log("Database Error")

    }
    
}

module.exports=dbConnect