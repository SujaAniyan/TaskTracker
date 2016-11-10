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
    
    //extracting sender email id and name from mail
    var fromAddress = JSON.parse(JSON.stringify(mail.from));
    if (fromAddress.length > 0) {
        fromAddress = fromAddress.pop();
        console.log("Sender email id: ", fromAddress.address );
        console.log("Sender name: ", fromAddress.name);
    }
    
    //extracting subject from mail
    console.log("Subject:", mail.subject);
     //extracting mail content from mail
    console.log("Content:", mail.html); 

 }).start();

