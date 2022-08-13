require('dotenv').config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const app=express();
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('views', __dirname + '/views')
app.set('veiw engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
// for encryption (new mongoose.Schema{

// })

const userSchema= new mongoose.Schema({
    email:String,
    password:String,
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["passsword"]});

const User=new mongoose.model("User", userSchema);



app.get("/",function(req,res){
    res.render("home.ejs");
});
app.get("/register",function(req,res){
    res.render("register.ejs");
});
app.get("/login",function(req,res){
    res.render("login.ejs");
});


app.post("/register", function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets.ejs");
        }
    });
})
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,foundUser){
        if(err){
            alert("credintial didnt matched");
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets.ejs");
                }
            }
        }
    });
    // res.render("login.ejs")
});



app.listen(3000,function(){
    console.log("server is started on port 3000");
})