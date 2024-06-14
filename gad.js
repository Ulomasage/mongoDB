const express =require("express")
const PORT=3233
const app=express();
const mongoose=require("mongoose")

app.use(express.json())

mongoose.connect("mongodb+srv://ejiogu339:iTWzQBRFAuoOXYkR@cluster0.0n0nfsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{console.log(`connection to database is established `)}).catch((err)=>{console.log(`unable to connect to the db because ${err}`)})

//create a schema
const userModel=new mongoose.Schema({
    name:String,
    email:String,
    stack:String,
    age:Number,
    sex:String,
},{timestamps:true}) 
const mymodel=mongoose.model("firstClass",userModel)
app.get("/",(req,res)=>{
    res.status(200).json("welcome to mongodb")
});

//create first user
app.post("/createuser",async(req,res)=>{
    try {
        const createUser=await mymodel.create(req.body)
        res.status(201).json({"message":`new user created`,createUser})
    } catch (error) {res.status(400).json(error.message)  
    }
})  

//get a student
app.get("/getallstudents",async(req,res)=>{
    try {
        const allstudents=await mymodel.find()
        res.status(200).json({"message":`kindly find below ${allstudents.length} students`,allstudents})
    } catch (error) {res.status(400).json(error.message)  
    }
})

//get one by id
app.get("/getone/:id",async(req,res)=>{
    try {
        let id=req.params.id
        let foundUser=await mymodel.findById(id)
        res.status(200).json({message:`kindly find below the requested student`,foundUser})
    } catch (error) {
        res.status(500).json(error.message)  
    }
})

//get one by other details 
app.get("/getones/:email",async(req,res)=>{
    try {
        let email=req.params.email
        let foundUser=await mymodel.findOne({email})
        res.status(200).json({message:`kindly find below the requested student`,foundUser})
    } catch (error) {
        res.status(500).json(error.message)  
    }
})

//udate 
// app.put("/update/:id",async(req,res)=>{
//     try {
//         let id=req.params.id
//         let update=await mymodel.findByIdAndUpdate(id,req.body,{new:true})
//         res.status(200).json({message:`user successfully updated`,update})
//     } catch (error) {
//         res.status(500).json(error.message)  
//     }
// })

//delete
app.delete("/delete/:id",async(req,res)=>{
    
    try {
        let id=req.params.id
        let deleteOne=await mymodel.findByIdAndDelete(id,req.body)
        res.status(200).json({message:`user successfully deleted`,deleteOne})
    } catch (error) {
        res.status(500).json(error.message)  
    }   
}) 
//app.get("/",(req,res)=>{
   // res.status(200).json("WELCOME TO MONGO DB API")
//});

app.listen(PORT,()=>{
    console.log(`server is connected to ${PORT}` )
});