var express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    cons = require("consolidate"),
    dust = require("dustjs-helpers");

    const { Pool, Client } = require('pg')
   
    app = express();

    // app.engine('dust', cons.dust);

    // app.set('view engine', 'dust');
    // app.set('views', __dirname + '/views');

    // app.use(express.static(path.join(__dirname, 'public')));

    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: false}));

    app.all('/', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
       });

    app.get('/users', function(req, res){
        const pool = new Pool({
            user: 'gp',
            host: '127.0.0.1',
            database: 'db-gp',
            password: '123456',
            port: 5432
          })
        pool.query('SELECT * FROM public.users', (err, result) => {
           // res.render('index', { user: result.rows})
           res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result.rows))

            pool.end()
          })
    });

    app.get('/', function(req, res, next) {
    // Handle the get for this route
    });
    
    app.post('/', function(req, res, next) {
    // Handle the post for this route
    });

    app.listen(3000, function(){
        console.log("Server started at Port 3000!")
    });