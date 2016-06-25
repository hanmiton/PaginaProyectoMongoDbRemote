var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var app_password = "1"

mongoose.connect('mongodb://node:node@ds023644.mlab.com:23644/hanmilton');

var cloudinary = require("cloudinary");

cloudinary.config( {
	cloud_name: "dot6c5g5b",
	api_key: "113749932721945",
	api_secret:"bHFddfhntRfgbf0wm8Sfkr9uwzg"
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(multer({dest: "./uploads"}));

var productSchema = {
	title: String,
	description: String,
	imageUrl: String,
	pricing: Number
};


var Product = mongoose.model("Product", productSchema);

app.set("view engine","jade");

app.use(express.static("public"));

app.get("/",function(req,res){
	res.render("index");
});

app.get("/menu",function(req,res){
	
	Product.find(function(error,documento){
		if(error){ console.log(error); }
		res.render("menu/index",{ products: documento })
	});
});

app.post("/admin",function(req,res){
	if(req.body.password== app_password){
		Product.find(function(error,documento){
		if(error){ console.log(error); }
		res.render("admin/index",{ products: documento })
	});
	}else{
		res.redirect("/");
	}
});

app.get("/admin",function(req,res){
	res.render("admin/form")
});
app.post( '/menu', upload.single( 'image_avatar' ), function( req, res, next ) {
  if(req.body.password == app_password){
  	var data = {
  		title: req.body.title,
  		description: req.body.description,
  		imageUrl: "data.png",
  		pricing: req.body.pricing
  	}

  	var product = new Product(data);
	//console.log(req.file.path);
	//res.render("index");
  	cloudinary.uploader.upload(req.file.path, function(result) { 
 		product.imageUrl = result.url;
 		product.save(function(err){
 			console.log(product);
 			res.render("index");
 		})
});
  }else{
  	return res.render("menu/new");
	
  }
  });

app.get("/menu/new", function(req,res){
	res.render("menu/new");
});

app.listen(8080);