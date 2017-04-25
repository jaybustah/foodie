var express = require('express')
var bodyParser = require('body-parser')
var path = require('path');
var expressValidator = require('express-validator')

var app = express()

 app.use(express.static(__dirname + '/public'));

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Body Parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Set static path
app.use(express.static(path.join(__dirname, 'public')))

// Global Vars
app.use(function(req, res, next) {
    res.locals.errors = null
    next()
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}))

// Some data
var employees = [

    {
        id: 1,
        first_name: 'Banana',
        //last_name: 'Halpert',
        //email: 'jhalpert@dunder-mifflin.com',
    },
    {
        id: 2,
        first_name: 'Bread',
        //last_name: 'Beasley',
        //email: 'pbeasley@dunder-mifflin.com',
    },
    {
        id: 1,
        first_name: 'Cheese',
        //last_name: 'Scott',
        //email: 'mscott@dunder-mifflin.com',
    }
]


/*
var list = ["foo", "bar"];
list.push("baz", "qux", "etcetera");
*/

// SetUp Routes
app.get('/', function (req, res) {
    res.render('index', {
        title: 'Food List',
        employees: employees
    })
})

app.post('/employees/add', function (req, res) {

    req.checkBody('first_name', 'First Name is Required').notEmpty()
    req.checkBody('last_name', 'Last Name is Required').notEmpty()
    req.checkBody('email', 'Email is Required').notEmpty()

    var errors = req.validationErrors()

    if (errors) {
        res.render('index', {
        title: 'Food List',
        employees: employees,
        errors: errors
    })
    } else {
        var employee = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        console.log('SUCCESS')
    }
})

app.listen(3000, function () {
    console.log('Server started on port 3000...')
})
