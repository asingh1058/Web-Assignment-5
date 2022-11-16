var express = require("express");
var app = express();
var path = require("path");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const registration = mongoose.createConnection("mongodb+srv://adarsh:mtPj3cjI0Hj4jndd@senecaweb.ujaugow.mongodb.net/?retryWrites=true&w=majority");
const blog = mongoose.createConnection("mongodb+srv://adarsh:mtPj3cjI0Hj4jndd@senecaweb.ujaugow.mongodb.net/?retryWrites=true&w=majority");
const article= mongoose.createConnection("mongodb+srv://adarsh:mtPj3cjI0Hj4jndd@senecaweb.ujaugow.mongodb.net/?retryWrites=true&w=majority");

const users_schema = new mongoose.Schema({
    "fName": String,
    "lName": String,
    "email": { "type": String, "unique": true},
    "username": { "type": String, "unique": true},
    "password": String,
    "dob": String,
    "phoneD": String,
});

const blog_schema = new mongoose.Schema({
    "blog_name": String
});

const article_schema = new mongoose.Schema({
    "article_name": String
});

const user_info = registration.model("registration", users_schema);
const blog_content = blog.model("blog", blog_schema);
const article_content = article.model("article", article_schema);

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("static"));

app.engine(".hbs", handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "blog.html"));
  });

app.get("/article", function (req, res) {
   res.sendFile(path.join(__dirname, "article.html"));
  });

app.get("/registration", function(req, res) {
    res.render("registration", {layout: false});
});

app.post("/registration", function(req, res){
    var regData = {
        fname: req.body.firstName,
        lname: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        dob : req.body.dob,
        phone: req.body.phone
    };

    function dateOfBirth(birth) 
    {
    const dofb = /^\d{2}-\d{2}-\d{4}$/;
    return dofb.test(birth); 
    }

    function phoneCheck(num) 
    {
    const phone = /^\d{3}-\d{3}-\d{4}$/;
    return phone.test(num); 
    }

    if(regData.username == "" && regData.password == "" && regData.dob == "" && regData.phone == "")
    {
        var regiError = "The field with * should be entered!!!";
        res.render("registration", { regiError: regiError, data: regData, layout: false });
    }
    else if(dateOfBirth(regData.dob) != true)
    {
        var dobError = "follow the format dd-mm-yyyy, include -";
        res.render("registration", { dobError: dobError, data: regData, layout: false });
    }
    else if(phoneCheck(regData.phone) != true)
    {
        var phoneError = "follow the format 123-456-7890, include -";
        res.render("registration", { phoneError: phoneError, data: regData, layout: false });
    }
    else if(regData.password.length < 6 || regData.password.length > 12)
    {
        var passwordError = "The password length should be between 6 to 12 characters"
        res.render("registration", { passwordError: passwordError, data: regData, layout: false});
    }
    else
    {
        res.render("login", {layout: false});
    }
    let accoutInfo = new user_info({      
        fName: regData.fname,
        lName: regData.lname,
        email: regData.email,
        username: regData.username,
        password: regData.password,
        dob: regData.dob,
        phone: regData.phone
        }).save((e, data) =>{
            if(e)
            {
            console.log(e);
            }
            else
            {
            console.log(data);
            }
        });
});         



app.get('/login', function(req, res){
  res.render("login", {layout: false});
});
app.post("/login", function(req, res){

  var loginData = {
      user: req.body.username,
      pass: req.body.password
  }

  function specialChar(str)
  {
  const speStr = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return speStr.test(str);
  }

  if(loginData.user == "" && loginData.pass == "" )
  {
      var loginError = "The username and the password should be entered!!!";
      res.render("login", { loginError: loginError, layout: false});
  }
  else if(specialChar(loginData.user) == true) //if there's special character return true
  {
      var otherError = "Special character is not allowed";
      res.render("login", { otherError: otherError, layout: false});
  }
  else
    {
        user_info.findOne({username: loginData.user, password:loginData.pass}, ["fName", "lName", "username"]).exec().then((data) =>{
            if(data) 
            {
             res.render("login_dashboard", {fName:data.fName, lName:data.lName, username:data.username, layout: false});
            }
            else
            {
             var userError = "Sorry, you entered the wrong username and/or password";
             res.render("login", {userError: userError, data: loginData, layout: false});
            }
         });
    }
});
app.listen(HTTP_PORT);
