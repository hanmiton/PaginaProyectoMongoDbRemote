var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var multer  = require('multer')
//var upload = multer({ dest: 'uploads/' })
var enfisemas = require('./data/data.json');
var prediccion = require('./data/prediccion.json')
var method_override = require("method-override");
var app_password = "1"
var Schema = mongoose.Schema;
var fs = require('fs');
var RandomForestClassifier = require('random-forest-classifier').RandomForestClassifier;

//mongoose.connect('mongodb://node:node@ds023644.mlab.com:23644/hanmilton');
//console.log(enfisemas);
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(method_override("_method"));
//app.use(method_override);//app.use(multer({dest: "./uploads"}));

var productSchemaJSON = {
	genero: Number,
	edad: Number,
	cig: Number,
	expa: Number,
	ip: Number,
	alcohol: Number,
	enfisema: Number
};

var productSchema = new Schema(productSchemaJSON);
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

app.put("/menu/:id", function( req, res){
		console.log(req.body);
		var data = {
			genero: req.body.genero,
	  		edad: req.body.edad,
	  		cig: req.body.cig,
	  		expa: req.body.expa,
	  		ip: req.body.ip,
	  		alcohol: req.body.alcohol,
	  		enfisema: req.body.enfisema,
		};

			Product.update({"_id": req.params.id},data,function(product){
			res.redirect("/menu");
			});				
				
});

app.get("/menu/edit/:id",function(req,res){
	var id_producto = req.params.id;

	Product.findOne({_id: id_producto},function(error,producto){
		res.render("menu/edit",{product: producto});
	});

});

app.post("/admin",function(req,res){
	   var primeros = enfisemas;
  	res.render("admin/index2",{ products: primeros })
});


app.get("/admin/prediccion",function(req,res){
    var predicciones = prediccion;
    var primeros= enfisemas;
    var indices= [];
    var n=0;
    for (i=0; i<2000; i++){
      if(primeros[i].ENFISEMA != predicciones[i].ENFISEMA){
        n++;
        indices.push(predicciones[i].ID);
      }    
    }
    console.log(indices);
    res.render("admin/index",{ products: predicciones, malos : n ,indices: indices})
});


app.get("/admin/comparacion",function(req,res){
    var predicciones = prediccion;
    var primeros= enfisemas;
    var indices= [];
    var n=0;
    for (i=0; i<2000; i++){
      if(primeros[i].ENFISEMA != predicciones[i].ENFISEMA){
        n++;
        indices.push(predicciones[i].ID);
      }    
    }
    console.log(indices);
    res.render("admin/comparacion",{ products: predicciones, malos : n ,indices: indices})
});

app.get("/admin",function(req,res){
	/*for(i=0; i<enfisemas.length; i++) {
		var data = {
		genero: enfisemas[i].GENERO,
  		edad: enfisemas[i].EDAD,
  		cig: enfisemas[i].CIG,
  		expa: enfisemas[i].EXPA,
  		ip: enfisemas[i].IP,
  		alcohol: enfisemas[i].ALCOHOL,
  		enfisema: enfisemas[i].ENFISEMA,
  		}
  		var product = new Product(data);
		//console.log(req.file);
		//res.render("index");
		product.save(function(err){
				console.log(product);
				//res.redirect("/menu");
			});
	}*/
	res.render("admin/form");

});

app.post( '/menu', function( req, res ) {

	console.log(req.body);

  	var data = {
  		genero: req.body.genero,
  		edad: req.body.edad,
  		cig: req.body.cig,
  		expa: req.body.expa,
  		ip: req.body.ip,
  		alcohol: req.body.alcohol,
  		enfisema: req.body.enfisema
  	}

  	var product = new Product(data);
	//console.log(req.file);
	//res.render("index");
	product.save(function(err){
		res.redirect("/menu");
	});

});

app.get("/menu/new", function(req,res){
	res.render("menu/new");
});

app.get("/menu/predecir", function(req,res){
	res.render("menu/predecir");
});

app.post("/menu/predecir", function(req,res){
	/*var testdata = [{
	    "GENERO": 0,
	    "EDAD": 26,
	    "CIG": 32,
	    "EXPA": 3,
	    "IP": 11,
	    "ALCOHOL": 0
	    //"ENFISEMA": 0
	  	}
	];

	var rf = new RandomForestClassifier({
    	n_estimators: 10
	});

	rf.fit(enfisemas, null, "ENFISEMA", function(err, trees){
	  //console.log(JSON.stringify(trees, null, 4));
	  var pred = rf.predict(testdata, trees);

  console.log(pred);
	
});
	res.render("menu/predecir");
	*/

	console.log(req.body);
	var data = [
  {
    "GENERO": 1,
    "EDAD": 35,
    "CIG": 32,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 24,
    "CIG": 0,
    "EXPA": 1,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 43,
    "CIG": 34,
    "EXPA": 3,
    "IP": 17,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 55,
    "CIG": 32,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 20,
    "CIG": 27,
    "EXPA": 2,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 36,
    "CIG": 27,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 54,
    "CIG": 2,
    "EXPA": 2,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 25,
    "CIG": 31,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 29,
    "CIG": 1,
    "EXPA": 1,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 21,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 21,
    "CIG": 29,
    "EXPA": 2,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 32,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 28,
    "CIG": 27,
    "EXPA": 2,
    "IP": 5,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 20,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 31,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 33,
    "CIG": 33,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 42,
    "CIG": 45,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 34,
    "CIG": 26,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 34,
    "CIG": 31,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 34,
    "CIG": 33,
    "EXPA": 3,
    "IP": 16,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 56,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 38,
    "CIG": 33,
    "EXPA": 3,
    "IP": 16,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 37,
    "CIG": 28,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 32,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 59,
    "CIG": 28,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 29,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 59,
    "CIG": 29,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 30,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 22,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 48,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 52,
    "CIG": 29,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 38,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 32,
    "CIG": 31,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 50,
    "CIG": 30,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 34,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 51,
    "CIG": 33,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 22,
    "CIG": 29,
    "EXPA": 2,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 27,
    "CIG": 27,
    "EXPA": 2,
    "IP": 4,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 22,
    "CIG": 28,
    "EXPA": 2,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 34,
    "CIG": 4,
    "EXPA": 2,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 39,
    "CIG": 31,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 40,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 34,
    "CIG": 34,
    "EXPA": 3,
    "IP": 16,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 59,
    "CIG": 30,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 21,
    "CIG": 29,
    "EXPA": 2,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 29,
    "CIG": 31,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 20,
    "CIG": 32,
    "EXPA": 2,
    "IP": 9,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 24,
    "CIG": 30,
    "EXPA": 2,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 30,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 51,
    "CIG": 31,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 47,
    "CIG": 0,
    "EXPA": 2,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 48,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 30,
    "EXPA": 2,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 25,
    "CIG": 29,
    "EXPA": 2,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 50,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 45,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 26,
    "CIG": 1,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 36,
    "CIG": 25,
    "EXPA": 3,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 42,
    "CIG": 30,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 48,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 42,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 27,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 47,
    "CIG": 31,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 41,
    "CIG": 27,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 51,
    "CIG": 31,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 31,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 30,
    "CIG": 28,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 27,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 54,
    "CIG": 29,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 24,
    "CIG": 31,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 22,
    "CIG": 30,
    "EXPA": 2,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 50,
    "CIG": 31,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 67,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 32,
    "CIG": 28,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 57,
    "CIG": 30,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 56,
    "CIG": 31,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 41,
    "CIG": 33,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 40,
    "CIG": 31,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 46,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 39,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 25,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 51,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 46,
    "CIG": 13,
    "EXPA": 2,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 49,
    "CIG": 35,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 43,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 26,
    "CIG": 28,
    "EXPA": 2,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 35,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 28,
    "CIG": 33,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 28,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 33,
    "CIG": 31,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 33,
    "CIG": 30,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 32,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 52,
    "CIG": 29,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 47,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 30,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 56,
    "CIG": 35,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 21,
    "CIG": 32,
    "EXPA": 2,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 48,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 38,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 40,
    "CIG": 33,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 30,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 31,
    "CIG": 28,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 52,
    "CIG": 11,
    "EXPA": 2,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 51,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 47,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 50,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 29,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 44,
    "CIG": 28,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 48,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 39,
    "EXPA": 3,
    "IP": 21,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 34,
    "CIG": 33,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 54,
    "CIG": 28,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 42,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 54,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 37,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 28,
    "CIG": 3,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 54,
    "CIG": 27,
    "EXPA": 3,
    "IP": 5,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 31,
    "CIG": 32,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 48,
    "CIG": 26,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 48,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 35,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 33,
    "CIG": 26,
    "EXPA": 2,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 28,
    "EXPA": 2,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 59,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 31,
    "CIG": 31,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 41,
    "CIG": 34,
    "EXPA": 3,
    "IP": 16,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 36,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 59,
    "CIG": 33,
    "EXPA": 3,
    "IP": 18,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 55,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 29,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 56,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 42,
    "CIG": 27,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 48,
    "CIG": 28,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 36,
    "CIG": 33,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 24,
    "CIG": 29,
    "EXPA": 2,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 55,
    "CIG": 29,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 35,
    "CIG": 27,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 23,
    "CIG": 30,
    "EXPA": 2,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 51,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 51,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 46,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 46,
    "CIG": 31,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 30,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 50,
    "CIG": 31,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 48,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 54,
    "CIG": 27,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 20,
    "CIG": 28,
    "EXPA": 2,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 47,
    "CIG": 39,
    "EXPA": 3,
    "IP": 32,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 21,
    "CIG": 30,
    "EXPA": 2,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 40,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 56,
    "CIG": 33,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 33,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 43,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 42,
    "CIG": 27,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 34,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 39,
    "CIG": 0,
    "EXPA": 2,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 30,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 52,
    "CIG": 11,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 39,
    "CIG": 12,
    "EXPA": 2,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 54,
    "CIG": 31,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 46,
    "CIG": 28,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 31,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 38,
    "CIG": 31,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 30,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 22,
    "CIG": 32,
    "EXPA": 2,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 20,
    "CIG": 12,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 41,
    "CIG": 28,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 44,
    "CIG": 27,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 39,
    "CIG": 33,
    "EXPA": 3,
    "IP": 18,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 43,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 44,
    "CIG": 28,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 33,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 41,
    "CIG": 5,
    "EXPA": 2,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 25,
    "CIG": 32,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 31,
    "EXPA": 2,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 43,
    "CIG": 33,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 53,
    "CIG": 31,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 22,
    "CIG": 32,
    "EXPA": 2,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 30,
    "CIG": 3,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 47,
    "CIG": 33,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 36,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 34,
    "CIG": 31,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 37,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 33,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 28,
    "CIG": 33,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 49,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 40,
    "CIG": 31,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 29,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 44,
    "CIG": 30,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 40,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 43,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 43,
    "CIG": 33,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 39,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 24,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 43,
    "CIG": 31,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 42,
    "CIG": 25,
    "EXPA": 3,
    "IP": 4,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 50,
    "CIG": 30,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 29,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 49,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 43,
    "CIG": 26,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 41,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 31,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 58,
    "CIG": 29,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 30,
    "EXPA": 2,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 24,
    "CIG": 30,
    "EXPA": 2,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 48,
    "CIG": 31,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 31,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 27,
    "CIG": 30,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 20,
    "CIG": 29,
    "EXPA": 2,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 27,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 43,
    "CIG": 27,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 46,
    "CIG": 31,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 26,
    "CIG": 11,
    "EXPA": 2,
    "IP": 2,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 27,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 47,
    "CIG": 30,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 41,
    "CIG": 27,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 31,
    "CIG": 39,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 41,
    "CIG": 28,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 19,
    "EXPA": 2,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 27,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 54,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 31,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 30,
    "CIG": 33,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 37,
    "CIG": 26,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 41,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 58,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 48,
    "CIG": 30,
    "EXPA": 3,
    "IP": 5,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 58,
    "CIG": 30,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 42,
    "CIG": 30,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 30,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 2,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 55,
    "CIG": 51,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 52,
    "CIG": 29,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 33,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 26,
    "EXPA": 3,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 36,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 25,
    "CIG": 28,
    "EXPA": 2,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 27,
    "EXPA": 2,
    "IP": 5,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 28,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 47,
    "CIG": 39,
    "EXPA": 3,
    "IP": 21,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 38,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 39,
    "CIG": 0,
    "EXPA": 2,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 43,
    "CIG": 27,
    "EXPA": 3,
    "IP": 4,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 34,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 52,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 32,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 59,
    "CIG": 33,
    "EXPA": 3,
    "IP": 17,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 50,
    "CIG": 32,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 49,
    "CIG": 31,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 26,
    "CIG": 7,
    "EXPA": 2,
    "IP": 7,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 30,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 57,
    "CIG": 30,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 29,
    "CIG": 31,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 35,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 23,
    "CIG": 29,
    "EXPA": 2,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 56,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 54,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 42,
    "CIG": 43,
    "EXPA": 3,
    "IP": 17,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 20,
    "CIG": 32,
    "EXPA": 2,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 47,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 48,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 25,
    "EXPA": 3,
    "IP": 4,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 31,
    "CIG": 32,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 29,
    "CIG": 26,
    "EXPA": 2,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 28,
    "EXPA": 2,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 56,
    "CIG": 65,
    "EXPA": 3,
    "IP": 19,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 26,
    "CIG": 29,
    "EXPA": 2,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 57,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 24,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 33,
    "CIG": 16,
    "EXPA": 2,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 23,
    "CIG": 31,
    "EXPA": 2,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 57,
    "CIG": 30,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 40,
    "CIG": 30,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 45,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 53,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 32,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 39,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 31,
    "CIG": 74,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 52,
    "CIG": 7,
    "EXPA": 2,
    "IP": 7,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 47,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 22,
    "CIG": 28,
    "EXPA": 2,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 30,
    "EXPA": 2,
    "IP": 14,
    "ALCOHOL": 0,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 37,
    "CIG": 32,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 30,
    "CIG": 31,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 30,
    "CIG": 31,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 52,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 28,
    "CIG": 28,
    "EXPA": 2,
    "IP": 4,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 38,
    "CIG": 32,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 36,
    "CIG": 32,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 57,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 23,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 26,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 37,
    "CIG": 6,
    "EXPA": 2,
    "IP": 1,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 25,
    "CIG": 30,
    "EXPA": 2,
    "IP": 9,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 62,
    "EXPA": 2,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 20,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 48,
    "CIG": 4,
    "EXPA": 2,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 34,
    "CIG": 5,
    "EXPA": 2,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 46,
    "CIG": 31,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 20,
    "CIG": 0,
    "EXPA": 1,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 29,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 29,
    "EXPA": 2,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 32,
    "CIG": 4,
    "EXPA": 2,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 38,
    "CIG": 29,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 42,
    "CIG": 39,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 8,
    "EXPA": 2,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 32,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 28,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 29,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 48,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 56,
    "CIG": 11,
    "EXPA": 2,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 51,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 53,
    "CIG": 28,
    "EXPA": 3,
    "IP": 32,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 30,
    "CIG": 27,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 41,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 28,
    "CIG": 29,
    "EXPA": 2,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 50,
    "CIG": 35,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 43,
    "CIG": 29,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 40,
    "CIG": 27,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 0,
    "EXPA": 1,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 35,
    "CIG": 30,
    "EXPA": 3,
    "IP": 4,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 50,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 39,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 53,
    "CIG": 80,
    "EXPA": 3,
    "IP": 18,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 51,
    "CIG": 32,
    "EXPA": 3,
    "IP": 16,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 55,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 24,
    "CIG": 11,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 46,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 41,
    "CIG": 28,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 53,
    "CIG": 39,
    "EXPA": 3,
    "IP": 32,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 53,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 41,
    "CIG": 18,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 28,
    "CIG": 6,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 48,
    "CIG": 33,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 47,
    "CIG": 30,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 50,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 0,
    "EXPA": 1,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 48,
    "CIG": 27,
    "EXPA": 3,
    "IP": 5,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 32,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 43,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 34,
    "CIG": 32,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 43,
    "CIG": 32,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 58,
    "CIG": 28,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 20,
    "CIG": 29,
    "EXPA": 2,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 40,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 38,
    "CIG": 0,
    "EXPA": 2,
    "IP": 4,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 53,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 73,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 31,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 21,
    "CIG": 7,
    "EXPA": 1,
    "IP": 4,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 51,
    "CIG": 27,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 45,
    "CIG": 29,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 50,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 47,
    "CIG": 30,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 37,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 58,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 47,
    "CIG": 32,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 39,
    "CIG": 31,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 39,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 39,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 46,
    "CIG": 1,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 43,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 49,
    "CIG": 28,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 90,
    "CIG": 29,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 51,
    "CIG": 8,
    "EXPA": 2,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 56,
    "CIG": 29,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 58,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 33,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 67,
    "CIG": 31,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 36,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 29,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 50,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 21,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 45,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 42,
    "CIG": 30,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 32,
    "CIG": 30,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 36,
    "CIG": 32,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 25,
    "CIG": 30,
    "EXPA": 2,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 41,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 35,
    "CIG": 11,
    "EXPA": 2,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 49,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 24,
    "CIG": 30,
    "EXPA": 2,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 47,
    "CIG": 27,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 53,
    "CIG": 30,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 27,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 45,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 48,
    "CIG": 31,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 53,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 36,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 43,
    "CIG": 34,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 33,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 47,
    "CIG": 32,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 57,
    "CIG": 30,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 37,
    "CIG": 32,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 27,
    "CIG": 28,
    "EXPA": 2,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 50,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 29,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 1,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 30,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 28,
    "CIG": 31,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 53,
    "CIG": 1,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 43,
    "CIG": 30,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 46,
    "CIG": 8,
    "EXPA": 2,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 77,
    "CIG": 32,
    "EXPA": 3,
    "IP": 19,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 31,
    "CIG": 30,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 28,
    "CIG": 31,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 22,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 21,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 23,
    "CIG": 29,
    "EXPA": 2,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 54,
    "CIG": 1,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 23,
    "CIG": 1,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 33,
    "CIG": 26,
    "EXPA": 2,
    "IP": 4,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 29,
    "EXPA": 2,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 25,
    "CIG": 30,
    "EXPA": 2,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 49,
    "CIG": 32,
    "EXPA": 3,
    "IP": 16,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 41,
    "CIG": 36,
    "EXPA": 3,
    "IP": 17,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 0,
    "EXPA": 1,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 59,
    "CIG": 2,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 56,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 39,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 36,
    "CIG": 28,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 40,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 30,
    "EXPA": 2,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 29,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 56,
    "CIG": 29,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 42,
    "CIG": 33,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 33,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 30,
    "CIG": 30,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 25,
    "CIG": 28,
    "EXPA": 2,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 55,
    "CIG": 33,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 59,
    "CIG": 29,
    "EXPA": 3,
    "IP": 5,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 29,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 38,
    "CIG": 26,
    "EXPA": 3,
    "IP": 3,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 27,
    "CIG": 32,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 38,
    "CIG": 29,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 35,
    "CIG": 31,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 33,
    "CIG": 30,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 30,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 35,
    "CIG": 31,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 45,
    "CIG": 32,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 51,
    "CIG": 7,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 43,
    "CIG": 13,
    "EXPA": 2,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 22,
    "CIG": 29,
    "EXPA": 2,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 40,
    "CIG": 33,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 49,
    "CIG": 31,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 37,
    "CIG": 33,
    "EXPA": 3,
    "IP": 12,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 31,
    "EXPA": 2,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 22,
    "CIG": 31,
    "EXPA": 2,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 28,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 44,
    "CIG": 34,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 30,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 59,
    "CIG": 28,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 36,
    "CIG": 31,
    "EXPA": 3,
    "IP": 10,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 76,
    "CIG": 39,
    "EXPA": 3,
    "IP": 21,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 55,
    "CIG": 28,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 32,
    "CIG": 1,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 21,
    "CIG": 12,
    "EXPA": 2,
    "IP": 2,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 27,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 41,
    "CIG": 28,
    "EXPA": 3,
    "IP": 5,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 44,
    "CIG": 0,
    "EXPA": 2,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 52,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 20,
    "CIG": 32,
    "EXPA": 2,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 29,
    "CIG": 0,
    "EXPA": 1,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 42,
    "CIG": 30,
    "EXPA": 3,
    "IP": 8,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 42,
    "CIG": 28,
    "EXPA": 3,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 38,
    "CIG": 37,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 36,
    "CIG": 30,
    "EXPA": 3,
    "IP": 9,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 57,
    "CIG": 0,
    "EXPA": 2,
    "IP": 0,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 1,
    "EDAD": 51,
    "CIG": 31,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 23,
    "CIG": 28,
    "EXPA": 2,
    "IP": 6,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 32,
    "CIG": 30,
    "EXPA": 3,
    "IP": 7,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 35,
    "CIG": 30,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 26,
    "CIG": 6,
    "EXPA": 2,
    "IP": 1,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 36,
    "CIG": 32,
    "EXPA": 3,
    "IP": 13,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 42,
    "CIG": 33,
    "EXPA": 3,
    "IP": 15,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 0,
    "EDAD": 26,
    "CIG": 32,
    "EXPA": 3,
    "IP": 11,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  },
  {
    "GENERO": 0,
    "EDAD": 52,
    "CIG": 48,
    "EXPA": 3,
    "IP": 16,
    "ALCOHOL": 1,
    "ENFISEMA": 1
  },
  {
    "GENERO": 1,
    "EDAD": 37,
    "CIG": 33,
    "EXPA": 3,
    "IP": 14,
    "ALCOHOL": 0,
    "ENFISEMA": 0
  }
  ];

var testdata = [{
   "GENERO": req.body.genero,
    "EDAD": req.body.edad,
    "CIG": req.body.cig,
    "EXPA": req.body.expa,
    "IP": req.body.ip,
    "ALCOHOL": req.body.alcohol
   // "ENFISEMA": 0
  }
];


var rf = new RandomForestClassifier({
    n_estimators: 10
});

rf.fit(data, null, "ENFISEMA", function(err, trees){
  //console.log(JSON.stringify(trees, null, 4));
  var pred = rf.predict(testdata, trees);

  console.log(pred);
res.render("menu/resultado", {resultado: pred, products: testdata});
  // pred = ["virginica", "setosa"]
});
	
});


app.get("/menu/delete/:id",function(req, res){
	var id = req.params.id;

	Product.findOne({"_id": id},function(err,producto){
		res.render("menu/delete",{producto: producto});
	});
});

app.delete("/menu/:id",function(req,res){
	var id = req.params.id;
	if(req.body.password == app_password){
		Product.remove({"_id" : id},function(err){
			if(err){ console.log(err);}
			res.redirect("/menu");
		});
	}else{
		res.redirect("/menu");
	}

});

app.listen(8000);	