const express  = require('express');
const app =express();
const port =3000;
const path=require('path')

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/basic', (req, res) => {
  res.render('basic');
});

app.get('/age', (req, res) => {
  res.render('age');
});

app.get('/scientific', (req, res) => {
  res.render('scientific');
})

app.listen(port,(req,res)=>{
    console.log('server is running on port' ,port);
})
