const express =require("express")
const dotenv=require("dotenv").config()
const PORT= process.env.port
const app=express();
const mongoose=require("mongoose")

app.use(express.json())

//Trying to add my code
mongoose.connect(process.env.db).then(()=>{console.log(`connection to database is established `)}).catch((err)=>{console.log(`unable to connect to the db because ${err}`)})

//create a schema
const date=new Date
const userModel=new mongoose.Schema({
    name:{type:String,required:[true,"kindly provide your name"]},
    email:{type:String,unique:true,required:[true,"kindly provide your email"]},
    stack:{type:String},
    dateOfBirth:{type:Number,required:true},
    sex:{type:String,required:true, enum:["MALE","FEMALE"]},
    age:{type:Number}
},{timestamps:true}) 
const mymodel=mongoose.model("SECONDMONGODB",userModel)
app.get("/",(req,res)=>{
    res.status(200).json("welcome to mongodb") 
});

//create first user
app.post("/createuser",async(req,res)=>{
    try {
        let{name,email,stack,dateOfBirth,sex,}=req.body
        let fullName=name.split(" ")
        console.log(fullName);
        let removedSpace = fullName.filter((space) => space !== "")
        console.log(removedSpace);
        let firstLetter=removedSpace[0].slice(0,1).toUpperCase()
        let remaining=removedSpace[0].slice(1).toLowerCase()
        let totalName=firstLetter+remaining

       //let lastName=removedSpace[removedSpace.length -1] 
       //console.log(lastName)

       let firstLetter2=removedSpace[1].slice(0,1).toUpperCase()
       let remaining2=removedSpace[1].slice(1).toLowerCase()
       let total2=firstLetter2+remaining2

        const data = {name,email:email.toUpperCase(),stack,dateOfBirth,sex:sex.toUpperCase(),age:date.getFullYear()-dateOfBirth}
        const createUser=await mymodel.create(data)
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
app.put("/update/:id",async(req,res)=>{
    try {
        let id=req.params.id
        let update=await mymodel.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json({message:`user successfully updated`,update})
    } catch (error) {
        res.status(500).json(error.message)  
    }
})

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