// All imports needed here
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

// Creates the express application
const app = express();
const port = 9090;

// Define all database connection constants
const mongoClient = mongodb.MongoClient;
const databaseURL = "mongodb://localhost:27017/";
const dbname = "studentsdb";

/**
  Creates an engine called "hbs" using the express-handlebars package.
**/
app.engine( 'hbs', exphbs({
  extname: 'hbs', // configures the extension name to be .hbs instead of .handlebars
  defaultView: 'main', // this is the default value but you may change it to whatever you'd like
  layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
  partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
}));

// Setting the view engine to the express-handlebars engine we created
app.set('view engine', 'hbs');

// Configuration for handling API endpoint data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/**
  First connection to the database once the application starts.
  This is so that we can create the collections needed prior to any transactions
  that we need to do.
**/
mongoClient.connect(databaseURL, function(err, client) {
  /**
    Only do database manipulation inside of the connection
    When a connection is made, it will try to make the database
    automatically. The collection(like a table) needs to be made.
  **/
  if (err) throw err;
  const dbo = client.db(dbname);

  //Will create a collection if it has not yet been made
  dbo.createCollection("students", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    client.close();
  });
});

/** ROUTES **/
// Home route
app.get('/', function(req, res) {
  // The render function takes the template filename (no extension - that's what the config is for!)
  // and an object for what's needed in that template
  res.render('home', { title: 'Home' });
});

// Students route
app.get('/students', function(req, res) {
  // TODO: Retrieve data from database and send data with template
  res.render('students', { title: 'Students' });
})


/** API endpoints **/

// Inserts a student in the database
app.post('/addStudent', function(req, res) {
  // From previous exercise
  const student = {
    name: req.body.name,
    id: req.body.id,
    img: `img/${req.body.gender}.png`
  };

  // TODO: Insert data to the database
  //       & send a custom message to send the "AJAX-way"

});

// Finds the students matching the name query from the database and returns the array
app.post('/searchStudents', function(req, res) {
  var query = {
    name: { $regex: '^' + req.body.name }
    // name: { $regex: `^${req.body.name}` }
  };

  // TODO: Search for the student from the database
  //       & return the array of objects for the template
});


/**
  To be able to render images, css and JavaScript files, it's best to host the static files
  and use the expected path in the data and the imports.

  This takes the contents of the public folder and makes it accessible through the URL.
  i.e. public/css/styles.css (in project) will be accessible through http://localhost:9090/css/styles.css
**/
app.use(express.static('public'));

// Listening to the port provided
app.listen(port, function() {
  console.log('App listening at port '  + port)
});
