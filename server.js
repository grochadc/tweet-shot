const screenshotTweet = require('screenshot-tweet');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

function generateID() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function addhttp(url) {
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "https://" + url;
   }
   return url;
}

function validURL(url){
  let regex = /twitter\.com\/\w+_?\/status\/\d+/g;
  return regex.test(url);
}

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/screenshot', (req, res) =>{
  if(!validURL(req.body.url)) res.send('Invalid url <a href="/">return home</a>');
  
  let id = generateID();
  let httpUrl = addhttp(req.body.url);
  screenshotTweet.default(
    httpUrl,
    path.join(__dirname, 'public', 'tweets',id+'.jpg')
  )
  .then(() => {
    res.redirect('/success?img='+id);
  })
  .catch(error => console.log('Error'));
});

app.get('/success', (req, res) => {
  let filepath = path.join('tweets',req.query.img+'.jpg');
  res.render('success',{filepath});
});

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
  console.log('App listening on port '+port);
});
