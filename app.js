
(function(){

    "use strict";

    var express     = require("express"),
        path        = require("path"),
        bodyParser  = require("body-parser"),
        cons        = require("consolidate"),
        dust        = require("dustjs-helpers");
        //globe = require('globe-connect');
    
    const cors = require('cors');
    const { Pool, Client } = require('pg');

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('AU24KPlatinum');
    
    
    var app = express();

    app.use(cors());
    app.options('*', cors());
    
    require('dotenv').config();

    // app.engine('dust', cons.dust);

    // app.set('view engine', 'dust');
    // app.set('views', __dirname + '/views');

    // app.use(express.static(path.join(__dirname, 'public')));

    // app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false}));

    app.all('/', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
       });

    // app.get('/users/:username/:password', function(req, res){
        
    //     const pool = new Pool();

    //     let username = req.params.username;
    //     let password = req.params.password;
        
    //     const sql = 'SELECT * FROM public."tbl-users" WHERE username=\''  + username + '\' AND password = \'' + password + '\'';
        
    //     pool.query(sql, (err, result) => {
    //         // res.render('index', { user: result.rows})
    //         res.setHeader('Content-Type', 'application/json');
    //         res.setHeader("Access-Control-Allow-Origin", "*");
    //         res.send(JSON.stringify(result.rows))

    //         pool.end()

    //       });
    // });

    var query = function(res, sql, params) {

        const pool = new Pool();        
        pool.query(sql, params, (err, result) => {
            if (err) {
                throw err
            }

            res.setHeader('Content-Type', 'application/json');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

            res.send(JSON.stringify(result.rows));

            pool.end();

        });
    }

    // app.get('/sms', function(req, res){
        
    //     const oauth = globe.Oauth('ydzRhRExGEu67Te8RGixxzu8od4ahd8y', '16c71f40c2621c6bfd1285f05e848a6accace1f4f110b590fdff353574a3e217');
    //     const sms = globe.Sms('21581199 (Cross-telco: 29290581199)', '[access_token]');
    //     var url = oauth.getRedirectUrl();

    //     console.log(url);

    // });


    app.get('/encrypt/:password', function(req, res){
        
        var encryptedString = cryptr.encrypt(req.params.password);

        res.send(JSON.stringify(encryptedString));

    });

    app.get('/decrypt/:hash', function(req, res){
        
        var decryptedString  = cryptr.decrypt(req.params.hash);

        res.send(JSON.stringify(decryptedString));

    });

    app.get('/users/:username/:password', function(req, res){
        
        const sql = 'SELECT * FROM users WHERE username=$1';
        const params = [req.params.username];

        const pool = new Pool();        
        pool.query(sql, params, (err, result) => {
            if (err) {
                throw err
            }

            res.setHeader('Content-Type', 'application/json');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

            var decryptedPass  = cryptr.decrypt(result.rows[0].password);

            if (decryptedPass === req.params.password) {
                res.send(JSON.stringify(result.rows));
            } else {
                res.send([]);
            }

            pool.end();

        });
        

    });

    app.get('/users/:id', function(req, res){
        
        const sql = 'SELECT * FROM users WHERE id=$1';
        const params = [req.params.id];
        
        query(res, sql, params);

    });

    app.get('/customers/:id', function(req, res){
        
        var sql = '',
            params = '';
        if (req.params.id > 0) {
            sql = 'SELECT * FROM customers WHERE id=$1';
            params = [req.params.id];
        } else {
            sql = 'SELECT * FROM customers ORDER BY lastname, firstname';
            params = [];
        }

        query(res, sql, params);

    });

    app.get('/pledges/:type', function(req, res){
        
        var sql = '',
            params = '';
        if (req.params.type > 0) {
            sql = 'SELECT * FROM pledges WHERE type=$1';
            params = [req.params.type];
        } else {
            sql = 'SELECT * FROM pledges ORDER BY pawnticket';
            params = [];
        }
        
        query(res, sql, params);

    });

    app.get('/loans/:id', function(req, res){
        
        //new_loan(clientid, amount,remarks)
        var sql = '',
            params = '';
        if (req.params.id > 0) {
            sql = `
            SELECT
            c.id as clientid,
            c.firstname,
            c.lastname,
            c.middlename,
            l.id as loanid,
            l.amount,
            CASE WHEN (SELECT sum(amount) FROM payments where loanid = l.id) IS NULL THEN 0
            ELSE (SELECT sum(amount) FROM payments where loanid = l.id) END as paid,
            (l.amount - 
            CASE WHEN (SELECT sum(amount) FROM payments where loanid = l.id) IS NULL THEN 0
            ELSE (SELECT sum(amount) FROM payments where loanid = l.id) END) as balance,
            l.dateadded, 
            (l.dateadded + cast('100 day' as interval))::date as duedate,
            l.status, l.remarks
            FROM loans l
            INNER JOIN clients c ON c.id = l.clientid
            WHERE l.id=$1`;
            params = [req.params.id];
        } else {
            sql = `
            SELECT
            c.id as clientid,
            c.firstname,
            c.lastname,
            c.middlename,
            l.id as loanid,
            l.amount,
            CASE WHEN (SELECT sum(amount) FROM payments where loanid = l.id) IS NULL THEN 0
            ELSE (SELECT sum(amount) FROM payments where loanid = l.id) END as paid,
            (l.amount - 
            CASE WHEN (SELECT sum(amount) FROM payments where loanid = l.id) IS NULL THEN 0
            ELSE (SELECT sum(amount) FROM payments where loanid = l.id) END) as balance,
            l.dateadded, 
            (l.dateadded + cast('100 day' as interval))::date as duedate,
            l.status, l.remarks
            FROM loans l
            INNER JOIN clients c ON c.id = l.clientid
            ORDER BY c.lastname, c.firstname`;
            params = [];
        }


        query(res, sql, params);

    });

    app.get('/collections/:date', function(req, res){
        
        //new_loan(clientid, amount,remarks)
        var sql = '',
            params = '';

        sql = `
        SELECT
        c.id as clientid,
        c.firstname,
        c.lastname,
        c.middlename,
        c.address,
        l.id as loanid,
        l.amount,
        (SELECT amount from payments p WHERE p.loanid=l.id and p.datepaid::date=$1::date  limit 1) as paid,
        (l.amount - 
        CASE WHEN (SELECT sum(amount) FROM payments where loanid = l.id) IS NULL THEN 0
        ELSE (SELECT sum(amount) FROM payments where loanid = l.id) END) as balance,
        l.dateadded,
        (l.dateadded + cast('100 day' as interval))::date as duedate,
        l.status, 
		(SELECT remarks from payments p WHERE p.loanid=l.id and p.datepaid::date=$1::date  limit 1) as remarks
        FROM loans l
        INNER JOIN clients c ON c.id = l.clientid`;
        params = [req.params.date];

        query(res, sql, params);

    });

    app.get('/dashboard', function(req, res){
        
        const sql = `SELECT
        CASE WHEN (SELECT SUM(amount) FROM funds WHERE type IN (2, 3, 5, 10)) IS NULL THEN 0
        ELSE (SELECT SUM(amount) FROM funds WHERE type IN (2, 3, 5, 10)) END as addedfunds,
        CASE WHEN (SELECT SUM(amount) FROM funds WHERE type IN (1, 11)) IS NULL THEN 0
        ELSE (SELECT SUM(amount) FROM funds WHERE type IN (1, 11)) END as withdrawnfunds,
        (CASE WHEN (SELECT SUM(amount) FROM funds WHERE type IN (2, 3, 5, 10)) IS NULL THEN 0
        ELSE (SELECT SUM(amount) FROM funds WHERE type IN (2, 3, 5, 10)) END) -
        (CASE WHEN (SELECT SUM(amount) FROM funds WHERE type IN (1, 11)) IS NULL THEN 0
        ELSE (SELECT SUM(amount) FROM funds WHERE type IN (1, 11)) END) as currentfunds`;
        // ,
        // (SELECT SUM(l.amount) FROM loans l 
        //     WHERE l.dateadded::date = NOW()::date) as todayloan,
        // (SELECT SUM(l.amount) FROM loans l 
        //     WHERE l.dateadded::date = (current_date - cast('1 day' as interval))::date) as yesterdayloan,
        // (SELECT SUM(l.amount) FROM loans l 
        //     WHERE l.dateadded::date BETWEEN (current_date - cast(textcat(text (date_part('dow', now())::text), ' days') as interval))::date 
        //     AND NOW()::date) as weekloan,
        // (SELECT SUM(p.amount) FROM payments p 
        //     WHERE p.datepaid::date = NOW()::date) as todaypayment,
        // (SELECT SUM(p.amount) FROM payments p
        //     WHERE p.datepaid::date = (current_date - cast('1 day' as interval))::date) as yesterdaypayment,
        // (SELECT SUM(p.amount) FROM payments p WHERE 
        //     p.datepaid::date BETWEEN (current_date - cast(textcat(text (date_part('dow', now())::text), ' days') as interval))::date 
        //     AND NOW()::date) as weekpayment,
        // (SELECT COUNT(c.id) FROM clients c 
        //      WHERE c.dateadded::date = NOW()::date) as todayclient,
        // (SELECT COUNT(c.id) FROM clients c 
        //      WHERE c.dateadded::date = (current_date - cast('1 day' as interval))::date) as yesterdayclient,
        // (SELECT COUNT(c.id) FROM clients c 
        //      WHERE c.dateadded::date BETWEEN (current_date - cast(textcat(text (date_part('dow', now())::text), ' days') as interval))::date 
        //          AND NOW()::date) as weekclient`;
        const params = [];
        
        query(res, sql, params);

    });

    app.get('/funds', function(req, res){
        
        const sql = `
        SELECT
        CASE WHEN (SELECT SUM(amount) FROM funds WHERE type IN (1, 4)) IS NULL THEN 0
        ELSE (SELECT SUM(amount) FROM funds WHERE type IN (1, 4)) END as deposit,
        CASE WHEN (SELECT SUM(amount) FROM funds WHERE type IN (2, 3)) IS NULL THEN 0
        ELSE (SELECT SUM(amount) FROM funds WHERE type IN (2, 3)) END as withdraw,
        (CASE WHEN (SELECT SUM(amount) FROM funds WHERE type IN (1, 4)) IS NULL THEN 0
        ELSE (SELECT SUM(amount) FROM funds WHERE type IN (1, 4)) END) -
        (CASE WHEN (SELECT SUM(amount) FROM funds WHERE type IN (2, 3)) IS NULL THEN 0
        ELSE (SELECT SUM(amount) FROM funds WHERE type IN (2, 3)) END) as funds`;
        const params = [];
        
        query(res, sql, params);

    });

    app.get('/funds/history', function(req, res){
        
        const sql = `SELECT 
        f.id,
        f.dateadded,
        f.amount,
        (SELECT p.pawnticket FROM pledges p WHERE p.id = f.pledgeid) as pawnticket,
        CASE WHEN type = 1 THEN 'Pledge'
            WHEN type = 2 THEN 'Redeem'
            WHEN type = 3 THEN 'Renew'
            WHEN type = 5 THEN 'Sold'
            WHEN type = 10 THEN 'Added Funds'
            WHEN type = 11 THEN 'Withdrawn Funds'
        END as type,
        f.remarks
        FROM funds f  
        `;
        const params = [];
        
        query(res, sql, params);

    });

    app.post('/customer/add', function(req, res){
        const sql = 'SELECT new_customer($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) as custid';
        const params = [ 
            req.body.customerid,
            req.body.firstname,
            req.body.middlename,
            req.body.lastname,
            req.body.birthdate,
            req.body.contact,
            req.body.address,
            req.body.idpresented,
            req.body.emailaddress,
            req.body.remarks,
            req.body.addedby
        ];
        
        query(res, sql, params);
    });

    app.post('/pledge', function(req, res){
        const sql = 'SELECT pledge($1, $2, $3, $4, $5, $6, $7, $8, $9) as pledgeid';
        const params = [
            req.body.customerid,
            req.body.pawnticket,
            req.body.amount,
            req.body.interest,
            req.body.frequency,
            req.body.description,
            req.body.servicecharge,
            req.body.remarks,
            req.body.pledgedby
        ];

        query(res, sql, params);
    });

    app.post('/redeem', function(req, res){
        const sql = 'SELECT redeem($1, $2, $3, $4, $5) as redeemid';
        const params = [
            req.body.pawnticket,
            req.body.amount,
            req.body.penalty,
            req.body.remarks,
            req.body.redeemedby
        ];

        query(res, sql, params);
    });

    app.post('/renew', function(req, res){
        const sql = 'SELECT renew($1, $2, $3, $4, $5, $5) as renewid';
        const params = [
            req.body.pawnticket,
            req.body.amount,
            req.body.amountprepaid,
            req.body.penalty,
            req.body.remarks,
            req.body.renewedby
        ];

        query(res, sql, params);
    });

    app.post('/repossess', function(req, res){
        const sql = 'SELECT repossess() as repossess';
        const params = [];

        query(res, sql, params);
    });

    app.post('/sold', function(req, res){
        const sql = 'SELECT renew($1, $2, $3, $4) as soldid';
        const params = [
            req.body.pawnticket,
            req.body.soldto,
            req.body.amount,
            req.body.remarks,
            req.body.soldby
        ];

        query(res, sql, params);
    });

    app.post('/fund/add', function(req, res){
        const sql = 'SELECT add_funds($1, $2, $3) as addedfund';
        const params = [req.body.amount, req.body.remarks, req.body.addedby];

        query(res, sql, params);
    });

    app.post('/fund/withdraw', function(req, res){
        const sql = 'SELECT withdraw_funds($1, $2, $3) as withdrawnfund';
        const params = [req.body.amount, req.body.remarks, req.body.addedby];

        query(res, sql, params);
    });
    
    app.post('/', function(req, res, next) {
    // Handle the post for this route
    });

    app.listen(process.env.PORT, function(){
        console.log(`Server started at Port ${process.env.PORT}`);
    });

})();