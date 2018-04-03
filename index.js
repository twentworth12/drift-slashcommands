const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('superagent');
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

// Set these in Heroku
const DRIFT_TOKEN = process.env.BOT_API_TOKEN

const GOOGLE_TOKEN = process.env.GOOGLE_API_TOKEN
const GOOGLE_CX = process.env.GOOGLE_CX_TOKEN

const IMGFLIP_USER = process.env.IMGFLIP_USER
const IMGFLIP_PASS = process.env.IMGFLIP_PASS


const CONVERSATION_API_BASE = 'https://driftapi.com/conversations'
const IMGFLIP_API_BASE = 'https://api.imgflip.com/caption_image'

function handleMessage(orgId, data) {
  if (data.type === 'private_note') {
    console.log("Drift private note")
    const messageBody = data.body
    const conversationId = data.conversationId

    // Okay, what command did we get
    if (messageBody.startsWith('/googlethat')) {
      console.log("Yeah! We found a /googlethat message!!!")
      return readMessage(conversationId, orgId, messageBody)
    }  
    if (messageBody.startsWith('/meme')) {
      console.log("Yeah! We found a /alvaro message!!!")
      return memeThat(conversationId, orgId, messageBody)
    }	  
  }
return
}

// Get the email address from Drift
function readMessage (conversationId, orgId, messageBody) {
	request
	  .get(CONVERSATION_API_BASE + `${conversationId}` + "/messages/")
	  .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
	  .set('Content-Type', 'application/json')
	  .end(function (err, res) {
		return googleThat(conversationId, orgId, GoogleThat, messageBody)
	   });
}

function memeThat (conversationId, orgId, messageBody) {
// Creates a meme using the imgflip API
	
	 if (messageBody.startsWith('/memethat')) {
	   var memeBody = messageBody.slice(10)
           var memeBody1 = memeBody.split(",")
	   console.log("body is " + memeBody1[0])
	   
	   switch (memeBody1[0]) {
		   case "boromir":
			   var memeChar = "61579";
			   break;
		   case "interesting":
			   var memeChar = "61532";
			   break;
		   case "oprah":
			   var memeChar = "28251713";
			   break;
		   case "wonka":
			   var memeChar = "61582";
			   break;
		   default:
			   var memeChar = "1509839";
	   }
           
	   request
	  .get(IMGFLIP_API_BASE + "?template_id=" + memeChar + "&username=" + IMGFLIP_USER + "&password=" + IMGFLIP_PASS + "&text0=" + memeBody1[1] + "&text1=" + memeBody1[2])
	  .set('Content-Type', 'application/json')
	  .end(function (err, res) {
		var meme = "<img src=" + res.body.data.url + ">"
		console.log("meme is " + meme);
		postMessage(meme, conversationId, orgId)
		return
	   });
	 }
}

function googleThat (conversationId, orgId, callbackFn, messageBody) {
// Searches google using the custom search API
	
	  customsearch.cse.list({
	    cx: GOOGLE_CX,
	    q: messageBody,
	    auth: GOOGLE_TOKEN
	  }, (err, res) => {
	    if (err) {
	      throw err;
	    }
		  
	  for (var i = 0; i < 6; ++i) {
	    if (res.data.items[i] != undefined) {

		var link = res.data.items[i];

	    var message = {
	    'orgId': orgId,
	    'body': body,
	    'type': 'private_prompt',
	    'buttons': [{
	      'label': 'Send This Result',
	      'value': "<p><a target=_blank href=" + link.link + ">" + link.title + "</a><br/>" + "</p>",
	      'type': 'reply',
	      'style': 'primary',
	      'reaction': {
		'type': 'delete'
	      }
	    },]
	  }  	 
		    
		callbackFn(message, conversationId, orgId);
		}
	  }
  });
	
}

function GoogleThat (message, conversationId, orgId) {
    return postMessage(message, conversationId, orgId);
}
	       
function postMessage(message, conversationId, orgId) {
	
    // Send the message
    request
    .post(CONVERSATION_API_BASE + `/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
    .send(message)
    .catch(err => console.log(err))
    return
}

app.use(bodyParser.json())
app.listen(process.env.PORT || 3000, () => console.log('googlethat listening on port 3000!'))
app.post('/api', (req, res) => {
  
  if (req.body.type === 'new_message') {
      handleMessage(req.body.orgId, req.body.data); 
  }
  return res.send('ok')
})
