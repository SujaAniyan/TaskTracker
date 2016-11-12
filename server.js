// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var expressLayouts = require('express-ejs-layouts')
//var favicon = require('serve-favicon');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var colors				= require('colors');
var constants			= require('./scripts/constants');
var config        = require(constants.paths.config + '/config');
var multer = require('multer');
var fs = require('fs');

// configuration ===============================================================
require('./scripts/database'); // load database management scripts
require('./scripts/process'); // load process management scripts
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('layout', 'layouts/mmain')

// set development environment configuration
if (app.get('env') === 'development') {
  app.locals.pretty = true;		//render html output with proper formating
}

if(config.get('env') === 'production') {
  app.locals.pretty = true;
}

if(config.get('env') === 'test') {
  app.locals.pretty = true;
}
app.use(expressLayouts);

// required for passport
require('./scripts/session')(app);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes/main')(app, passport);

// launch ======================================================================
app.listen(port);

var util = require('./scripts/util');
var appInfoServ = require('./services/appService');

var appInfo = appInfoServ.info();
console.log(colors.blue(util.formatString("\nApplication: %s ver %s:%s", appInfo.name, appInfo.version, appInfo.gitHash )));
console.log(colors.blue(util.formatString('   running at port %s', port)));

var notifier = require('mail-notifier');

var imap = {
      user: "saniyan@csc.com",
      password: "Arun@5247",
      host: "outlook.office365.com",
      port: 993,
      tls: true,
      connTimeout: 50000, // Default by node-imap
      authTimeout: 50000, // Default by node-imap,
      debug: console.log, // Or your custom function with only one incoming argument. Default: null
      tlsOptions: { rejectUnauthorized: false },
      mailbox: "INBOX", // mailbox to monitor
      searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved
};

notifier(imap).on('mail',function(mail){
    var index, dueDate = null, priority = "Medium";
    //extracting sender email id and name from mail
    var fromAddress = JSON.parse(JSON.stringify(mail.from));
    var senderEmailid,senderName,mailSubject,mailHtml;
    if (fromAddress.length > 0) {
        fromAddress = fromAddress.pop();
        senderEmailid = fromAddress.address;
        senderName =  fromAddress.name;
    }

    var toAddresses="";
    var toAddress = JSON.parse(JSON.stringify(mail.to));
    while (toAddress.length > 0) {
        toAddress = toAddress.pop();
        toAddresses += toAddress.name +",";        
    }
    if (toAddresses.contains(",")){
        toAddresses = toAddresses.substr(0, toAddresses.length-1); 
    }
    
    //extracting subject from mail
    console.log("Subject:", mail.subject);
    mailSubject =  mail.subject;
    
    if(mailSubject && mailSubject.contains("@duedate:"))
    {
        index = mailSubject.indexOf("@duedate:");        
        dueDate = mailSubject.substr(index+9, index+19);
        console.log(dueDate);
    }
    
    if(mailSubject && mailSubject.contains("@priority:"))
    {
        index = mailSubject.indexOf("@priority:");        
        priority = mailSubject.substr(index+10, index+20);
        console.log(priority);
    }
    
     //extracting mail content from mail
    console.log("Content:", mail.html); 
    mailHtml = mail.html;
    mailHtml = mailHtml.substr(0, mailHtml.length-1); 
    
    var request = require('request');
    request.post('http://localhost:8080/api/v1/secure/tasks/',
         {form:
            {
             taskAssignedBy : senderName,
             taskAssignedTo : toAddresses,
             taskTitle      : mailSubject,
             taskDetails    : mailHtml,
             dueDate        : dueDate,
             priority       : priority
            }
    });   
    
    //Check for attachments, if exists extract each attachment and save it to the file system ["uploads" folder] 
    if (mail.attachments) {
        mail.attachments.forEach(function (attachment) {
            fs.writeFile( __dirname + "/uploads/" + attachment.generatedFileName, attachment.content, 'base64', function(err) {
                   if (err!=null)
                        console.log("Error = " + err);
                });
        });
    }
    
    
}).start();
