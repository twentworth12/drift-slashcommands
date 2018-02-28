const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('superagent');

const DRIFT_TOKEN = process.env.BOT_API_TOKEN

const CONVERSATION_API_BASE = 'https://driftapi.com/conversations'
const CONTACT_API_BASE = 'https://driftapi.com/contacts'


function handleMessage(orgId, data) {
  if (data.type === 'private_note') {
    const messageBody = data.body
    const conversationId = data.conversationId

    if (messageBody.startsWith('/googlethat')) {
      console.log("Yeah! We found a /googlethat message!!!")
      return readMessage(conversationId, orgId, messageBody)
    }
  }
}

// Get the email address from Drift
function readMessage (conversationId, orgId, messageBody) {
	request
	  .get(CONVERSATION_API_BASE + `${conversationId}` + "/messages/")
	  .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
	  .set('Content-Type', 'application/json')
	  .end(function (err, res) {
	 	console.log("data is " + res.body.data.messages[0].body);
		return googleThat(conversationId, orgId, GoogleThat, messageBody)
	   });
}

function googleThat (conversationId, orgId, callbackFn, messageBody) {
	
	var body = "";
	var google = require('google')

	google.resultsPerPage = 5
	var nextCounter = 0

	var query = messageBody.slice(-11);

	google(query, function (err, res){
  		if (err) console.error(err)

		  for (var i = 0; i < 5; ++i) {
		    var link = res.links[i];
		    body = body + "<p style='visibility: hidden;'><a href=" + link.href + ">" + link.title + "</a><br/>" + "</p>";
		  }
		callbackFn(body, conversationId, orgId);
		})
}

function GoogleThat (body, conversationId, orgId) {
    return postMessage(body, conversationId, orgId);
}
	       
function postMessage(body, conversationId, orgId) { 

		
    const message = {
    'orgId': orgId,
    'body': body,
    'type': 'private_prompt',
  	}
  
    
  	// Send the message
    request
    .post(CONVERSATION_API_BASE + `/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .set(`Authorization`, `bearer ${DRIFT_TOKEN}`)
    .send(message)
    .catch(err => console.log(err))  
}

app.use(bodyParser.json())
app.listen(process.env.PORT || 3000, () => console.log('googlethat listening on port 3000!'))
app.post('/api', (req, res) => {
  
  if (req.body.type === 'new_message') {
      handleMessage(req.body.orgId, req.body.data);  
  }
  return res.send('ok')
})
