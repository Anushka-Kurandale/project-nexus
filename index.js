const express = require("express");
const pasth = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));


app.set("view engine", 'ejs');

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});


app.post("/signup", async (req, res) => {

    const data = {
         name: req.body.username,
         password: req.body.password
    }
     
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
      res.send("User already exists. Please choose a different username.");
    } else {
      const saltRounds = 10;
    
      try {
        
        const passwordToHash = String(data.password);
    
        
        const hashedPassword = await bcrypt.hash(passwordToHash, saltRounds);
    
   
        data.password = hashedPassword;
    
        const newUser = new collection(data);
        const result = await newUser.save();
        console.log(result);
    
       
        res.send("User registered successfully.");
      } catch (error) {
        
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      }
    }   
}); 


app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({name: req.body.username});
       if(!check) {
           res.send("user name cannot found");
       }
   
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

      //console.log(isPasswordMatch);
  
      if (isPasswordMatch) {
         res.render("home");
      } else{
        res.send("Incorrect password");
      }
    } catch{
       res.send("Error during login");
    }
  });
  
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is runnig on port: ${PORT}`);
})

