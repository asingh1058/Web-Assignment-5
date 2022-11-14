var express = require("express");
var app = express();
var path = require("path");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");

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
      //return;
  }
  else if(specialChar(loginData.user) == true) //if there's special character return true
  {
      var otherError = "Special character is not allowed";
      res.render("login", { otherError: otherError, layout: false});
  }
  else
  {
      res.render("dashboard", {layout: false});
  }
});
  

app.listen(HTTP_PORT);
