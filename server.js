const express = require('express');
const mongoose = require('mongoose');
//const db = require('./config/keys').mongoURI;
const app = express();
var bodyParser = require('body-parser')

//routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//LOCAL
mongoose.connect("mongodb://localhost:27017/devcon", { useNewUrlParser: true });
const db = mongoose.connection

db.once('open', () => {
  console.log('Connected to MongoDB LOCAL!');
});

// Check DB Errors
db.on('error', (err) => {
  console.log(err);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Online
//mongoose.connect(db)
//    .then(()=> console.log("Connected to MongoDB"))
//    .catch(err => console.log("ERROR FROM MONGODB: ", err));

app.get('/', (req, res)=> res.send("Hello World!"));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts); 

const port = process.env.PORT || 8080;

app.listen(port, ()=> console.log("Server is running on port: ", port));