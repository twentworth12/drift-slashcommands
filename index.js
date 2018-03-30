const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('superagent');
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

// Set this in Heroku
const DRIFT_TOKEN = process.env.BOT_API_TOKEN
const GOOGLE_TOKEN = process.env.GOOGLE_API_TOKEN
const GOOGLE_CX = process.env.GOOGLE_CX_TOKEN

const CONVERSATION_API_BASE = 'https://driftapi.com/conversations'

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

	 if (messageBody.startsWith('/meme')) {
	   request
	  .get("https://api.imgflip.com/caption_image?template_id=14859329&username=IMGFLIP_USER&pass=IMGFLIP_PASS&text0=" + messageBody)
	  .end(function (err, res) {
		var meme = "<a href=" + res.url + ">"
		console.log("meme is " + JSON.stringify(res, undefined, 2);
		postMessage(meme, conversationId, orgId)
		return
	   });
	 }
}


function googleThat (conversationId, orgId, callbackFn, messageBody) {
	
	
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

		body = "<p><a target=_blank href=" + link.link + ">" + link.title + "</a><br/>" + "</p>";
		callbackFn(body, conversationId, orgId);
		}
	  }	    
  });
	
}

function GoogleThat (body, conversationId, orgId) {
    return postMessage(body, conversationId, orgId);
}
	       
function postMessage(body, conversationId, orgId) { 	

  const message = {
    'orgId': orgId,
    'body': body,
    'type': 'private_prompt',
    'buttons': [{
      'label': 'Send This Result',
      'value': body,
      'type': 'reply',
      'style': 'primary',
      'reaction': {
        'type': 'delete'
      }
    },]
  }   
    
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
