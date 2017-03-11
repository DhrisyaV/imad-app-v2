var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto=require('crypto');
var bodyParser=require('body-parser');

var Pool = require('pg').Pool;
var config={
    
    user:'dhrisyav',
    database:'dhrisyav',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
}

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});



function hash(input, salt)
{
    
    var hashed=crypto.pbkdf2Sync(input,salt, 10000, 512, 'sha512');
    return ['pbkdf2', "10000", salt, hashed.toString('hex'), "this-si-a-random-string"];
}


app.post('/create-user',function(req,res)
{
    var username=req.body.username;
    var password=req.body.password;
    var salt= crypto.getRandomBytes(128).toString('hex');
    var dbString= hash(password, salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString], function(err,result)
    {if(err)
       {
           res.status(500).send(err.toString());
       }
        else
       {
           res.send('User successfully created');
       } });
});
app.get('/hash/:input', function (req,res){
   var hashedstring= hash(req.params.input,'this-si-a-random-string' );
   res.send(hashedstring)
});
var pool = new Pool(config)

app.get('/test-db', function (req, res)
{
    pool.query ('SELECT * FROM test', function(err,result)
    {
       if(err)
       {
           res.status(500).send(err.toString());
       }
        else
       {
           res.send(JSON.stringify(result));
       } 
       
       

});
});
app.get('/articles/:articlename', function (req, res){
    var articlename= req.params.articlename;
    pool.query("SELECT * FROM article WHERE title = '"+ req.params.articlename + "'", function(err,result){
     if(err)
       {
           res.status(500).send(err.toString());
       }
      
       else
       {
           if(result.rows.length===0)
           {res.status(404).send('article not found');
           }
           else
           {
               var articledata= result.rows[0];
           
                res.send(createTemplate(articledata));
           }
    
       }
       });
   
});

function createTemplate(data)
{
    var title=data.title;
    var heading=data.heading;
    var date=data.date;
    var content=data.content;
    
    var htmltemplate= `
    <html>
    <head>
    <title>
    ${title}
    </title>
    </head>
    <body>
    <h3>
    ${heading}
    </h3>
    <div>
    ${content}
    </div>
    </body>
    </html>
    `;
    
return htmltemplate;
    
}


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
