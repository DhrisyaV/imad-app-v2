console.log('Loaded!');
var submit = document.getElementById('submit-btn');
submit.onclick=function(){
var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
console.log(username);
console.log(password);
request.open('POST','http://dhrisyav.imad.hasura-app.io/login'+ name,true);
request.send(JSON.stringify({username : username, password : password}));
}