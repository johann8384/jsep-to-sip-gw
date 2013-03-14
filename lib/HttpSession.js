var uuid = require('node-uuid'),
util = require('util'),
EventEmitter = require('events').EventEmitter,
sdpParser = require('./sdpParser.js'),
logger = require('./logwinston'),
request = require('request'),
registrarDb = require('../lib/registrar_db').getDb();

function HttpSession(options){
		this.msg = {
			sdp: '',
			candidates: []
		};
    this.sessid = sess;
    this.role = opts.role;
		this.calldirection = opts.calldirection || 'sipbound';
    this.inviteSent = false;
    this.id = null; 
    this.accepted = (this.role == 'caller') ? true : false;
    this.to= opts.to;
    this.from= opts.from,
    this.display= opts.display;
    this.cseq= null;
    this.http= true;
    this.callbackUrl= opts.callbackUrl;
    this.linkedSession = null;
    this.undelivered = [];
};

util.inherits(HttpSession, EventEmitter);
//For the outbound leg, dips into DB to search for the endpoint, and reaches out if it exists
//Updates pass to linked Session
HttpSession.prototype.initiateLeg = function(){
  var self = this;
  if(this.to){
    registrardb.get(this.to, function(err, regs){
      if(regs){ 
        self.callbackUrl = regs[0].callbackUrl; 
        var msg = {to: self.to, from: self.from, type: 'invite', uuid: self.uuid};
        self.messageEndpoint(msg);  
      }else{
        self.messageLinkedSession({type: 'invite', failure: true, reason: 404});
      }
    });
  }
}

HttpSession.prototype.messageLinkedSession = function(msg, cb){
  this.linkedSession.emit('fromLinked', msg);
  if(cb)
    cb();
}

HttpSession.prototype.messageEndpoint = function(msg, cb){
  request({method: 'POST', uri: this.callbackUrl + this.sessid,
           json: true, body: msg},
          function(error, response, body){
            if(error)
              logger.log('Problem reaching endpoint');
            if(cb)
              cb();
            });
}

HttpSession.prototype.AddMessage = function(message) {
    switch(this.calldirection){
      //Call starts from HTTP ROAP needed to gather Offer candidates
      case 'sipbound':
        this.messageLinkedSession(message);
        break;
      case 'httpbound':
        this.messageLinkedSession(message);
        break;
   }
}


module.exports = HttpSession;